<template>
  <h1>test</h1>
  <div class="flex gap-3">
    <button @click="connect">Connect</button>
    <button @click="disconnect">Disconnect</button>
    <button @click="sendMessage">Send</button>
  </div>
</template>

<script setup lang="ts">
import { io } from 'socket.io-client'

const socket = io('http://localhost:3000', {
  autoConnect: false,
  transports: ['websocket'],
})

const connect = () => {
  socket.connect()
}

const disconnect = () => {
  socket.disconnect()
}

const sendMessage = () => {
  socket.emit('message', 'Hello from Vue!')
}
</script>
