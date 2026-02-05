import { Trans } from 'react-i18next'

import { InfoPanel } from './InfoPanel'

type TransWrapperProps = {
  i18nKey: string
  className?: string
}

const githubIssuesHref = 'https://github.com/DarBrick/padel-boy/issues'

export function TransWrapper({ i18nKey, className = 'content-section' }: TransWrapperProps) {
  return (
    <div className={className}>
      <Trans
        i18nKey={i18nKey as any}
        parent="div"
        components={{
          infoPanel: <InfoPanel />,
          githubIssuesLink: (
            <a
              href={githubIssuesHref}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--color-padel-yellow)] hover:underline"
            />
          ),
        }}
      />
    </div>
  )
}
