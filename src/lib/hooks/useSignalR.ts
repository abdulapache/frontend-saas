'use client'

import { useEffect, useRef, useCallback } from 'react'
import * as signalR from '@microsoft/signalr'
import Cookies from 'js-cookie'

const SIGNALR_URL = process.env.NEXT_PUBLIC_SIGNALR_URL || 'http://localhost:5005'

export function useSignalR() {
  const connectionRef = useRef<signalR.HubConnection | null>(null)

  useEffect(() => {
    const token = Cookies.get('accessToken')
    if (!token) return

    const connection = new signalR.HubConnectionBuilder()
      .withUrl(`${SIGNALR_URL}/hubs/notifications`, {
        accessTokenFactory: () => token,
      })
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.None)
      .build()

    connectionRef.current = connection

    connection.start().catch(() => {
      // Notification service not running — real-time notifications unavailable, not fatal
    })

    return () => {
      connection.stop()
    }
  }, [])

  const on = useCallback(<T>(event: string, handler: (data: T) => void) => {
    connectionRef.current?.on(event, handler)
    return () => connectionRef.current?.off(event, handler)
  }, [])

  const invoke = useCallback((method: string, ...args: unknown[]) =>
    connectionRef.current?.invoke(method, ...args), [])

  return { on, invoke, connection: connectionRef.current }
}
