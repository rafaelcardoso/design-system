import 'isomorphic-fetch'

import core from '@pluralsight/ps-design-system-core'
import Icon from '@pluralsight/ps-design-system-icon/react'
import React from 'react'

import { GithubIcon, TextLink } from './index'

const ChangeLog = props => {
  const changeLogUrl = `https://github.com/pluralsight/design-system/blob/master/packages/${
    props.packageName
  }/CHANGELOG.md`
  const label = props.version ? `v${props.version}` : 'CHANGELOG'
  return (
    <div className="version">
      <TextLink href={changeLogUrl} target="_blank">
        <span className="text">
          {label}
          <div className="icon">
            <GithubIcon color={Icon.colors.orange} />
          </div>
        </span>
      </TextLink>
      <style jsx>{`
        .version {
          font-size: ${core.type.fontSizeSmall};
        }
        .text {
          display: flex;
          align-items: center;
        }
        .icon {
          display: flex;
          align-items: center;
          margin-left: ${core.layout.spacingXSmall};
        }
      `}</style>
    </div>
  )
}

const getPackagesApiHost = _ => {
  const host = process.env.PACKAGES_API_HOST
  if (!host) throw new Error('process.env.PACKAGES_API_HOST required')
  return host
}

export default class extends React.Component {
  constructor(props) {
    super(props)
    this.state = { packages: null }
  }
  async fetchPackages() {
    try {
      const res = await fetch(getPackagesApiHost() + '/api/v2/packages')
      const json = await res.json()
      if (res.ok) {
        this.setState(_ => ({ packages: json.data }))
      }
    } catch (err) {
      console.log('err', err)
    }
  }
  componentWillMount() {
    if (this.props.packageName) this.fetchPackages()
  }
  render() {
    return this.state.packages ? (
      <ChangeLog
        version={
          this.state.packages[
            `@pluralsight/ps-design-system-${this.props.packageName}`
          ]
        }
        packageName={this.props.packageName}
      />
    ) : null
  }
}
