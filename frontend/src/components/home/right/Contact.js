export default function Contact({ user }) {
  return (
    <div className="contact">
      <div className="contact_img">
        <img src={user.picture} alt="" />
      </div>
      <span>
        {user.firstname} {user.lastname}
      </span>
    </div>
  )
}
