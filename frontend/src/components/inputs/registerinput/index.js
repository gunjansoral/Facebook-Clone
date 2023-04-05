import { useField, ErrorMessage } from 'formik'
import React from 'react'
import { useMediaQuery } from 'react-responsive'
import './style.css'

const RegisterInput = ({ bottom, ...props }) => {
    const [field, meta] = useField(props)
    const view1 = useMediaQuery({
        query: '(min-width: 539px)'
    })
    const view2 = useMediaQuery({
        query: '(min-width: 850px)'
    })
    const view3 = useMediaQuery({
        query: '(min-width: 1170px)'
    })
    const test1 = view3 && field.name === 'firstname'
    const test2 = view3 && field.name === 'lastname'
    return (
        <div className="input_wrap register_input_wrap">
            <input
                className={meta.touched && meta.error ? "input_error_border" : ""}
                style={{
                    width:
                        `${view1 && (field.name === 'firstname' || field.name === 'lastname') ?
                            '100%'
                            : view1 && (field.name === 'email' || field.name === 'password') ? '370px'
                                : '300px'
                        }`
                }}
                type={field.type}
                name={field.name}
                placeholder={props.placeholder}
                {...field}
                {...props} />

            {meta.touched && meta.error && (
                <div
                    className={view3 ? 'input_error input_error_desktop' : 'input_error'}
                    style={{ transform: "translateY(2px)", left: `${test1 ? '-107%' : test2 ? '107%' : ''}` }}>
                    {meta.touched && meta.error && <ErrorMessage name={field.name} />}
                    {meta.touched && meta.error && (
                        <div className={view3 && field.name !== 'lastname'
                            ? "error_arrow_left"
                            : test2 ? "error_arrow_right"
                                : !view3 && "error_arrow_bottom"}></div>
                    )}
                </div>
            )}
            {meta.touched && meta.error &&
                <i className="error_icon" ></i>}
        </div >
    )
}

export default RegisterInput