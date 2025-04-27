import Aura from '@primeuix/themes/aura'
import { definePreset } from '@primeuix/themes'

const OnlyChat = definePreset(Aura, {
  semantic: {
    colorScheme: {
      light: {
        content: {
          borderColor: '{surface.300}',
        },
      },
      dark: {
        content: {
          borderColor: '{surface.700}',
        },
      },
    },
  },
})

export default OnlyChat
