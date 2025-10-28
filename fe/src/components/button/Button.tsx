import React from 'react'

interface ButtonProps {
  varient: "primary" | "secondary"
  text: string
  OnClick?: () => void
  isClickAble?: boolean
}

const styles = {
  primary: "bg-blue-500 text-white rounded-full h-12 w-35 text-center",
  secondary: "bg-gray-300 text-black rounded-xl h-10 w-30 text-center",
}

const Button = (props: ButtonProps) => {
  return (
    <button
      className={`${styles[props.varient]} ${
        props.isClickAble ? "" : "opacity-50 cursor-not-allowed"
      }`}
      disabled={!props.isClickAble}
      onClick={props.OnClick}
    >
      {props.text}
    </button>
  )
}

export default Button
