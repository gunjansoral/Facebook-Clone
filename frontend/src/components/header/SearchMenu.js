import { useRef, useState } from "react";
import { Return, Search } from "../../svg";
import useClickOutside from '../../helpers/clickOutside'
import { useEffect } from "react";

export default function SearchMenu({ color, setShowSearchMenu }) {
  const [iconVisible, setIconVisible] = useState(true)
  const menu = useRef(null)
  const input = useRef(null)
  const inputFocus = () => {
    input.current.focus()
  }
  useEffect(() => {
    inputFocus()
  }, [])
  useClickOutside(menu, () => {
    setShowSearchMenu(false)
  })
  return (
    <div className="header_left search_area scrollbar" ref={menu}>
      <div className="search_wrap">
        <div className="header_logo">
          <div className="circle hover1"
            onClick={() => setShowSearchMenu(false)}>
            <Return color={color} />
          </div>
        </div>
        <div className="search" onClick={inputFocus} >
          {iconVisible && <div>
            <Search color={color} />
          </div>}

          <input type="text"
            placeholder="Search Facebook"
            ref={input}
            onFocus={() => setIconVisible(false)}
            onBlur={() => setIconVisible(true)}
          />
        </div>
      </div>
      <div className="search_history_header">
        <span>Recent searches</span>
        <a href="">Edit</a>
      </div>
      <div className="search_history"></div>
      <div className="search_results scrollbar"></div>
    </div>
  )
}
