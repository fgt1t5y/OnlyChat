import Aura from '@primeuix/themes/aura'
import { definePreset } from '@primeuix/themes'

import type { AuraBaseTokenSections } from '@primeuix/themes/aura/base'

const semantic: AuraBaseTokenSections.Semantic = {
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
}

const OnlyChat = definePreset(Aura, {
  semantic: semantic,
})

export default OnlyChat
