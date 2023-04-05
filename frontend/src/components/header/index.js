import './style.css'
import { Link } from 'react-router-dom'
import { ArrowDown, Home, Friends, Gaming, HomeActive, Logo, Market, Menu, Notifications, Search, Watch, Messenger } from '../../svg'
import { useSelector } from 'react-redux'
import SearchMenu from './SearchMenu'
import { useRef, useState } from 'react'
import AllMenu from './AllMenu'
import useClickOutside from '../../helpers/clickOutside'
import UserMenu from './userMenu'
export default function Header({ page }) {
  const { user } = useSelector((user) => ({ ...user }))
  const [showSearchMenu, setShowSearchMenu] = useState(false)
  const [showAllMenu, setShowAllMenu] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const color = '#65676b'
  const allMenu = useRef(null)
  const userMenu = useRef(null)
  useClickOutside(allMenu, () => {
    setShowAllMenu(false)
  })
  useClickOutside(userMenu, () => {
    setShowUserMenu(false)
  })
  return (
    <header>
      <div className="header_left">
        <Link to='/' className='header_logo'>
          <div className="circle">
            <Logo />
          </div>
        </Link>
        <div className="search search1" onClick={() => setShowSearchMenu(true)}>
          <Search color={color} />
          <input
            type="text"
            placeholder='Search Facebook'
            className='hide_input'
          />
        </div>
      </div>
      {showSearchMenu &&
        <SearchMenu
          setShowSearchMenu={setShowSearchMenu}
          color={color}
        />}
      <div className="header_middle">
        <Link to='/' className={`middle_icon ${page === 'home' ? 'active' : 'hover1'}`}>
          {page === 'home' ? <HomeActive /> : <Home color={color} />}
        </Link>
        <Link to='/' className='middle_icon hover1'>
          <Friends color={color} />
        </Link>
        <Link to='/' className='middle_icon hover1'>
          <Watch color={color} />
          <div className="middle_notification">9+</div>
        </Link>
        <Link to='/' className='middle_icon hover1'>
          <Market color={color} />
        </Link>
        <Link to='/' className='middle_icon hover1'>
          <Gaming color={color} />
        </Link>
      </div>
      <div className="header_right">
        <Link
          to='/profile'
          className={`profile_link hover1 ${page === 'profile' ? 'active_link' : ''
            }`}>
          <img src={user?.picture} alt="" />
          <span>{user?.firstname}</span>
        </Link>
        <div
          className={`circle_icon hover1 ${showAllMenu && 'active_header'}`}
          ref={allMenu} >
          <div onClick={() =>
            setShowAllMenu((prev) => !prev)
          } >
            <div style={{ transform: 'translateY(2px)' }}>
              <Menu />
            </div>
          </div>
          {showAllMenu && <AllMenu ref={allMenu} />}
        </div>
        <div className="circle_icon hover1">
          <Messenger />
        </div>
        <div className="circle_icon hover1">
          <Notifications />
          <div className="right_notification">5</div>
        </div>
        <div
          className={`circle_icon hover1 ${showUserMenu && 'active_header'}`}
          ref={userMenu} >
          <div
            onClick={() =>
              setShowUserMenu((prev) => !prev)
            }>
            <div style={{ transform: 'translateY(2px)' }}>
              <ArrowDown />
            </div>
          </div>
          {showUserMenu && <UserMenu ref={userMenu} user={user} />}
        </div>
      </div>
    </header >
  )
}
