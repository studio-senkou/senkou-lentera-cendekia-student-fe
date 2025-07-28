import { createFormHook } from '@tanstack/react-form'

import {
  FileInput,
  Select,
  SubscribeButton,
  TextArea,
  TextField,
} from '../components/form'
import { fieldContext, formContext } from '../contexts/form-context'

export const { useAppForm } = createFormHook({
  fieldComponents: {
    TextField,
    Select,
    TextArea,
    FileInput,
  },
  formComponents: {
    SubscribeButton,
  },
  fieldContext,
  formContext,
})
