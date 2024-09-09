import React from 'react'

const Button = ({submit,text}) => {
  return (
     
      <div>
          <button
            type="submit"
            className="btn btn-primary btn-md mr-6"
            onClick={submit}
          >
             {text}
          </button>
        </div>
  )
}

export default Button
