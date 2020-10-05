import React from 'react'
import {NavLink} from 'react-router-dom'
import "./NavItem.css";

export default ({children, to, external, ...rest}) => {
  if (external) {
    return <a href={to} target="_blank" className="header-nav__item">{children}</a>
  }

  return (
    <NavLink to={to} className="header-nav__item" activeClassName="header-nav__item--active" {...rest}>
      {children}
    </NavLink>
  )
}