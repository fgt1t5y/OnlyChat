import Aura from '@primeuix/themes/aura'
import { definePreset } from '@primeuix/themes'

import type { AuraBaseTokenSections } from '@primeuix/themes/aura/base'

const semantic: AuraBaseTokenSections.Semantic = {
  overlay: {
    modal: {
      borderRadius: '{border.radius.xl}',
      padding: '0.5rem',
      shadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
    },
  },
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
  transitionDuration: 'none',
}

const OnlyChat = definePreset(Aura, {
  semantic: semantic,
})

export default OnlyChat
