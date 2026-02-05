import { TransWrapper } from './TransWrapper'

interface ContentWithInfoPanelsProps {
  i18nKey: string
  className?: string
}

export function ContentWithInfoPanels({ i18nKey, className = 'content-section' }: ContentWithInfoPanelsProps) {
  return <TransWrapper i18nKey={i18nKey} className={className} />
}
