import React from 'react'

const Button = ({submit,text,disabled}) => {
  return (
     
      <div>
          <button
            type="submit"
            className="btn btn-primary btn-md mr-6"
            onClick={submit}
            disabled={disabled}
          >
             {text}
          </button>
        </div>
  )
}

export default Button
