import "./loginCard.module.css";

export default function LoginCard({ title, children }) {
  return (
    <div className="mycard">
      <h2 className="title">{title}</h2>
      {children}
    </div>
  )
}
