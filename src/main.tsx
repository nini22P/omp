import React from 'react'
import ReactDOM from 'react-dom/client'
import { PublicClientApplication } from '@azure/msal-browser'
import { MsalProvider } from '@azure/msal-react'
import { msalConfig } from './graph/authConfig'
import { RouterProvider } from 'react-router-dom'
import { i18n } from '@lingui/core'
import { I18nProvider } from '@lingui/react'
import { messages as enMessages } from './locales/en/messages'
import { messages as zhCNMessages } from './locales/zh-CN/messages'
import './index.css'
import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
import 'react-virtualized/styles.css'
import router from './router'

const msalInstance = new PublicClientApplication(msalConfig)

const messages = {
  'en': enMessages,
  'zh-CN': zhCNMessages,
}

const languages = Object.keys(messages)
const langage = navigator.language

i18n.load(messages)

i18n.activate(languages.includes(langage) ? langage : 'en')

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <I18nProvider i18n={i18n}>
      <MsalProvider instance={msalInstance}>
        <RouterProvider router={router} />
      </MsalProvider>
    </I18nProvider>
  </React.StrictMode>
)
