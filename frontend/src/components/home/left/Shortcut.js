export default function Shortcut({ img, link, name }) {
  return (
    <a href={link} target='_blank' rel='noreferrer' className="shortcut_item">
      <img src={`../../images/${img}.png`} alt="" />
      <span>{name}</span>
    </a>)
}
