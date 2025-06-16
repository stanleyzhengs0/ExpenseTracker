import React, { useEffect, useState } from 'react'
import DashboardLayout from '../../components/layouts/DashboardLayout'
import { useUserAuth } from '../../hooks/useUserAuth'
import { API_PATHS } from '../../utils/apiPaths'
import ExpenseOverview from '../../components/Expense/ExpenseOverview'
import axiosInstance from '../../utils/axiosInstance'
import Modal from '../../components/Modal'
import AddExpenseForm from '../../components/Expense/AddExpenseForm'
import toast from 'react-hot-toast'
import ExpenseList from '../../components/Expense/ExpenseList'
import DeleteAlert from '../../components/DeleteAlert'

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

   // Delete Income
  const handleDeleteExpense = async (id) => {
    try{
      await axiosInstance.delete(API_PATHS.EXPENSE.DELETE_EXPENSE(id))

      setOpenDeleteAlert({show: false, data: null})
      toast.success("Expense details deleted successfully")
      fetchExpenseDetails()

    }catch(error){
      console.error(
        "Error deleting expense: ",
        error.response?.data?.message || error.message
      )
    }

  }

   // handleDownloadExpenseDetails
  const handleDownloadExpenseDetails = async () => {
    try{
      const response = await axiosInstance.get(API_PATHS.EXPENSE.DOWNLOAD_EXPENSE,{
        responseType: "blob"
      })

      // Create a URL for the blob
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement("a")
      link.href = url
      link.setAttribute("download", "expense_details.xlsx")
      document.body.appendChild(link)
      link.click()
      link.parentNode.removeChild(link)
      window.URL.revokeObjectURL(url)

    }catch(error){
      console.error("Error downloading expense details: ", error)
      toast.error("Failed to download expense details. Please try again.")
    }

  }

  useEffect(() => {
    fetchExpenseDetails()

    return () => {}
  },[])


  return (
    <DashboardLayout activeMenu="Expense">
      <div className='my-5 mx-auto'>
          <div>
            <div>
                <ExpenseOverview
                  transactions={expenseData}
                  onExpenseIncome={() => setOpenAddExpenseModal(true)}
                />
            </div>

            <ExpenseList
              transactions={expenseData}
              onDelete={(id) => {
                setOpenDeleteAlert({show: true, data: id })
              }}
              onDownload={handleDownloadExpenseDetails}
            />
        </div>

        <Modal
          isOpen={openAddExpenseModal}
          onClose={() => setOpenAddExpenseModal(false)}
          title="Add Expense"
        >
          <AddExpenseForm onAddExpense = {handleAddExpense}/>
        </Modal>

        <Modal
          isOpen={openDeleteAlert.show}
          onClose={() => setOpenDeleteAlert({show: false, data: null})}
          title="Delete Expense"
        >
          <DeleteAlert
            content="Are you sure you want to delete this expense detail"
            onDelete={() => handleDeleteExpense(openDeleteAlert.data)}
          />
        </Modal>
      </div>
    </DashboardLayout>
  )
}

export default Expense
