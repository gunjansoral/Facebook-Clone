import { useRef, useState, useEffect } from "react";
import Picker from 'emoji-picker-react'
import useClickOutside from "../../helpers/clickOutside";

export default function CreateComments({ user }) {
  const [picker, setPicker] = useState(false)
  const [text, setText] = useState('')
  const [error, setError] = useState('')
  const [cursorPosition, setCursorPosition] = useState()
  const [commentImage, setCommentImage] = useState()
  const textRef = useRef(null)
  const imgRef = useRef(null)
  const emoRef = useRef(null)
  useEffect(() => {
    textRef.current.selectionEnd = cursorPosition
  }, [cursorPosition])
  const handleEmoji = (e, { emoji }) => {
    const ref = textRef.current
    ref.focus()
    const start = text.substring(0, ref.selectionStart)
    const end = text.substring(ref.selectionStart)
    const newText = start + emoji + end
    setText(newText)
    setCursorPosition(start.length + emoji.length)
  }
  useClickOutside(emoRef, () => {
    setPicker(false)
  })
  const handleImage = e => {
    let file = e.target.files[0]
    if (file.type !== 'image/jpeg' &&
      file.type !== 'image/gif' &&
      file.type !== 'image/png' &&
      file.type !== 'image/webp'
    ) {
      setError(`${file.name} format is not supported.`)
      return
    } else if (file.size > 1024 * 1024 * 5) {
      setError(`${file.name} is too large, max 5 mb is allowed.`)
      return
    }

    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = event => {
      setCommentImage(event.target.result)
    }
  }
  return (
    <div className="create_comment_wrap">
      <div className="create_comment">
        <img src={user?.picture} alt="" />
        <div className="comment_input_wrap">
          {picker && (
            <div className="comment_emoji_picker" ref={emoRef}>
              <Picker onEmojiClick={handleEmoji} />
            </div>
          )}
          <input
            type="file"
            hidden
            ref={imgRef}
            accept='image/jpeg, image/gif, image/png, image/webp'
            onChange={handleImage}
          />
          {error && (
            <div className="postError comment_error">
              <div className="postError_error">{error}</div>
              <button className="blue_btn" onClick={() => setError('')} >Try again</button>
            </div>
          )}
          <input
            type="text"
            ref={textRef}
            value={text}
            placeholder='Write a commment...'
            onChange={(e) => setText(e.target.value)}
          />
          <div className="comment_circle_icon hover2"
            onClick={() => {
              setPicker((prev) => !prev)
            }}
          >
            <i className="emoji_icon"></i>
          </div>
          <div className="comment_circle_icon hover2"
            onClick={() => imgRef.current.click()}
          >
            <i className="camera_icon"></i>
          </div>
          <div className="comment_circle_icon hover2" >
            <i className="gif_icon"></i>
          </div>
          <div className="comment_circle_icon hover2" >
            <i className="sticker_icon"></i>
          </div>
        </div>
      </div>
      {commentImage && (
        <div className="comment_img_preview">
          <img src={commentImage} alt="" />
          <div className="small_white_circle"
            onClick={() => setCommentImage('')}>
            <i className="exit_icon"></i>
          </div>
        </div>
      )}
    </div>
  )
}
