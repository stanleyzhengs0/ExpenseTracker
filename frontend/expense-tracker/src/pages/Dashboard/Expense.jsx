import React, { useEffect, useState } from 'react'
import DashboardLayout from '../../components/layouts/DashboardLayout'
import { useUserAuth } from '../../hooks/useUserAuth'
import { API_PATHS } from '../../utils/apiPaths'

const Expense = () => {
  useUserAuth()

  const [ openAddExpenseModal ,setOpenAddExpenseModal ] = useState(false)
  const [ loading, setLoading ] = useState(false)

  const [openDeleteAlert, setOpenDeleteAlert ] = useState({
    show: false,
    data: null
  })
  const [ expenseData, setExpenseData ] = useState([])

    // Get All Expense Details
  const fetchExpenseDetails = async () => {
    if (loading) return

    setLoading(true)

    try{
      const response = await axiosInstance.get(`${API_PATHS.EXPENSE.GET_ALL_EXPENSE}`)

      if(response.data){
        setExpenseData(response.data)
      }

    }catch(error){
      console.log("Something went wrong. Please try again.", error)
    }finally{
      setLoading(false)
    }
  }

  // Handle Add Income
  const handleAddExpense = async (expense) => {
    const {category, amount, date, icon } = expense

    // Validation Checks
    if(!category.trim()){
      toast.error("Category is required.")
      return
    }

    if(!amount || isNaN(amount) || Number(amount) < 0){
      toast.error("Amount should be a valid number greater than 0.")
    }

    if(!date){
      toast.error("Date is required.")
    }

    try{

      await axiosInstance.post(API_PATHS.EXPENSE.ADD_EXPENSE, {
        category, 
        amount,
        date,
        icon,
      })

      setOpenAddExpenseModal(false)
      toast.success("Expense added successfully")
      fetchExpenseDetails()

    }catch(error){
      console.error(
        "Error adding expense: ",
        error.response?.data?.message || error.message
      )
    }
  }

  useEffect(() => {
    fetchExpenseDetails()

    return () => {}
  },[])


  return (
    <DashboardLayout activeMenu="Expense">
      <div>expense</div>
    </DashboardLayout>
  )
}

export default Expense
