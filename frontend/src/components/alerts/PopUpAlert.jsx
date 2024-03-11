const PopUpAlert = ({children, color}) => {
  return (
    <div className={`fixed top-0 right-2 w-[300px] h-10 flex  ${color} justify-center items-center`}>
        {children}
    </div>
  )
}

export default PopUpAlert
