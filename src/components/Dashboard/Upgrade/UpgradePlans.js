import React,{useEffect,useState} from 'react'
import {useSelector,useDispatch} from 'react-redux'
import axios from 'axios';
import URLS from '../../../extras/enviroment'
import { message, notification,Modal ,Button} from 'antd';
import Intl from 'intl'
import 'intl/locale-data/jsonp/en-IN'

const couponsArray = [
    {
        couponName:'FREE WINTER',
        couponCode:'WINTERISCOMING',
        discoutPersent:90
    },
    {
        couponName:'50% OFF',
        couponCode:'GET50',
        discoutPersent:50
    },
    {
        couponName:'FREE 4 STUDENT',
        couponCode:'STUDENT',
        discoutPersent:99.9
    }
]



export default function UpgradePlans() {
    const user = useSelector(state=>state.login.oauthDetails)
    const configs = useSelector(state=>state.configs)
    const membership = configs.membership
    const paymentDetails = configs.paymentDetails ? configs.paymentDetails : null
    const [plans,setPlans] = useState({
        personal:{
            
            
        },
        pro:{
            
        }
    })
    const [selectedPlan,setSelectedPlan] = useState({})
    const [showCheckoutModal,setCheckoutModal] = useState(false)
    const [orderPrice,setOrderPrice] = useState(0)
    const [coupon,setCoupon] = useState("")
    const [discountAvailed,setDiscountAvailed] = useState({})
   const formatAmount = (amount)=>{
        return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount)
    }
    useEffect(()=>{
       const perosnalPrice = 1000
       const proPrice = 2000


       setPlans({
        personal:{
            
            amount:perosnalPrice,
            formatedAmount:formatAmount(perosnalPrice)
        },
        pro:{
            amount:proPrice,
            formatedAmount:formatAmount(proPrice)
        }
       })
      
       
    },[])

var openNotificationWithIcon = (type,msg,desc) => {
      notification[type]({
        message: msg,
        description:desc
          
      });
    };
    const  onPayClick = async(amount,planType)=>{
        let proceed = false
        if(membership.planType=='FREE' || (membership.planType=='PERSONAL' && planType=='PRO') ){
                proceed = true
        }
        if(proceed){
            setCheckoutModal(true)
            setSelectedPlan({amount,planType})
            setOrderPrice(amount)
        }else{
            message.error('Cannot buy the memebership!')
        }
     }
     const onCouponApply = ()=>{
        console.log(coupon)
        let cp = couponsArray.filter(cou=>cou.couponCode===coupon)
        if(cp.length>0){
            const currentCoupon = cp[0]
            console.log(currentCoupon)
            let totalDiscount = (selectedPlan.amount / 100) * currentCoupon.discoutPersent
            console.log(totalDiscount)
            setDiscountAvailed({
                couponDetail:currentCoupon,
                totalDiscount:totalDiscount
            })
            setOrderPrice(orderPrice-totalDiscount)
        }else{
            message.error('INVALID COUPON USED !')
        }
     }
     const createOrder = async()=>{
        let order = await axios.post(URLS.CUSTOMER.CREATE_ORDER_TO_UPGRADE,{amount:orderPrice * 100})
        console.log(order,orderPrice,user)
        var options = {
            "key": order.data.razorPay.key_id, // Enter the Key ID generated from the Dashboard
            "amount": orderPrice * 100 , // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
            "currency": "INR",
            "name": "Trimlly",
            "description": "Trimlly Plan upgrade",
            "image": 'https://www.trimlly.com/trimllyLogo.png',
            "order_id": order.data.order.id,
            "callback_url": `${URLS.CUSTOMER.PAYMENT_VERIFY}${selectedPlan.planType}/${user.email}`,
            "prefill": {
                "name": user.displayName ? user.displayName : user.email,
                "email": user.email,
            }
        };
        var rzp1 = new window.Razorpay(options);
        rzp1.on('payment.failed', function (response){
            openNotificationWithIcon('error','Payment Failed',response.error.description)
    });
        rzp1.open();
     }
   
     const canleOrder = ()=>{
        setCheckoutModal(false)
       setDiscountAvailed({})
        setSelectedPlan({})
        setOrderPrice(0)
        setCoupon("")
     }
  return (
    <div className='container mx-auto pb-10'>
    
       <Modal title="Order Summary" open={showCheckoutModal} onCancel={()=>canleOrder()}
       
       footer={[
        <Button key="back" onClick={()=>setCheckoutModal(false)}>
            CANCEL
        </Button>,
        
        <Button
          key="link"
      
          type="primary"
        
          onClick={()=>createOrder()}
        >
         PAY NOW
        </Button>,
      ]}
       >
       <div class="flex justify-center  md:flex-row flex-col items-stretch w-full space-y-4 md:space-y-0 md:space-x-6 xl:space-x-8">
        <div class="flex flex-col px-4 py-6 md:p-6 xl:p-8 w-full bg-gray-50 dark:bg-gray-800 space-y-6">
          <h3 class="text-xl dark:text-white font-semibold leading-5 text-gray-800">Summary</h3>
          <div class="flex justify-center items-center w-full space-y-4 flex-col border-gray-200 border-b pb-4">
            <div class="flex justify-between w-full">
              <p class="text-base dark:text-white leading-4 text-gray-800">Subtotal</p>
              <p class="text-base dark:text-gray-300 leading-4 text-gray-600">{formatAmount(selectedPlan.amount)}</p>
            </div>
            {discountAvailed.totalDiscount && <div class="flex justify-between items-center w-full">
              <p class="text-base dark:text-white leading-4 text-gray-800">Discount ({discountAvailed.couponDetail.couponName})</p>
              <p class="text-base dark:text-gray-300 leading-4 text-gray-600">- {formatAmount(discountAvailed.totalDiscount)} </p>
            </div>}
            
          </div>
          <div class="flex justify-between items-center w-full">
            <p class="text-base dark:text-white font-semibold leading-4 text-gray-800">Total</p>
            <p class="text-base dark:text-gray-300 font-semibold leading-4 text-gray-600">{formatAmount(orderPrice)}</p>
          </div>
          <div class="flex justify-between items-center w-full">
           <input value={coupon} onChange={(e)=>setCoupon(e.target.value)} className=' rounded-md w-auto px-5 p-1 border-2 border-black border-opacity-25'  placeholder='Enter Coupon' />
           <button disabled={discountAvailed.totalDiscount>0} onClick={()=>onCouponApply()} className='bg-blue-700 text-white p-1 px-5 rounded-sm'>Apply</button>
          </div>
        </div>
        

      </div>

     </Modal>
      <section class="bg-white dark:bg-gray-900">
  <div class="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
      <div class="mx-auto max-w-screen-md text-center mb-8 lg:mb-12">
          <h2 class="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">Designed for people like you !</h2>
          <p class="mb-5 font-light text-gray-500 sm:text-xl dark:text-gray-400">Here at Trimlly we focus on markets where technology, innovation, and capital can unlock long-term value and drive economic growth.</p>
      </div>
      <div class="space-y-8 lg:grid lg:grid-cols-3 sm:gap-6 xl:gap-10 lg:space-y-0">
          {/* <!-- Pricing Card --> */}
          <div class="flex flex-col p-6 mx-auto max-w-lg text-center text-gray-900 bg-white rounded-lg border border-gray-100 shadow dark:border-gray-600 xl:p-8 dark:bg-gray-800 dark:text-white">
          {membership.planType==='FREE' && <span>CURRENT PLAN</span>}
              <h3 class="mb-4 text-2xl font-semibold">Starter</h3>
              <p class="font-light text-gray-500 sm:text-lg dark:text-gray-400">Best for testing &  creating few url's and partial analytics for your links clicks</p>
              <div class="flex justify-center items-baseline my-8">
                  <span class="mr-2 text-5xl font-extrabold">FREE</span>
                  <span class="text-gray-500 dark:text-gray-400">/lifetime</span>
              </div>
              {/* <!-- List --> */}
              <ul role="list" class="mb-8 space-y-4 text-left">
                  <li class="flex items-center space-x-3">
                  <svg class="w-5 h-5 text-red-500" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
               
                 <span>Unlimited Links (Max 15)</span>
                  </li>
                  <li class="flex items-center space-x-3">
                      <svg class="w-5 h-5 text-red-500" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                    <span>Password Protected Links (Max 1)</span>
                  </li>
                  <li class="flex items-center space-x-3">
                    
                      <svg class="w-5 h-5 text-red-500" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                    <span>Bio Links</span>
                  </li>
                  <li class="flex items-center space-x-3">
                  <svg class="w-5 h-5 text-red-500" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                    <span>Developer API's </span>
                  </li>
                  <li class="flex items-center space-x-3">
                      <svg class="flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>
                      <span>Support:<span class="font-semibold">24 Months</span></span>
                  </li>
              </ul>
              </div>
          {/* <!-- Pricing Card --> */}
          <div class="flex flex-col p-6 mx-auto max-w-lg text-center text-gray-900 bg-white rounded-lg border border-gray-100 shadow dark:border-gray-600 xl:p-8 dark:bg-gray-800 dark:text-white">
         
              <h3 class="mb-4 text-2xl font-semibold">Personal</h3>
              <p class="font-light text-gray-500 sm:text-lg dark:text-gray-400">Relevant for personal use, extended & premium support & features.</p>
              <div class="flex justify-center items-baseline my-8">
                  <span class="mr-2 text-5xl font-extrabold">{plans.personal.formatedAmount}</span>
                  <span class="text-gray-500 dark:text-gray-400">/year</span>
              </div>
              {/* <!-- List --> */}
              <ul role="list" class="mb-8 space-y-4 text-left">
                  <li class="flex items-center space-x-3">
                  <svg class="flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>
                    
                 <span>Unlimited Links</span>
                  </li>
                  <li class="flex items-center space-x-3">
                  <svg class="flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>
                      <span>Password Protected Links (Max 10)</span>
                  </li>
                  <li class="flex items-center space-x-3">
                    
                  <svg class="flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>
                        <span>Bio Links (Max 1)</span>
                  </li>
                  <li class="flex items-center space-x-3">
                  <svg class="w-5 h-5 text-red-500" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                    <span>Developer API's </span>
                  </li>
                  <li class="flex items-center space-x-3">
                      <svg class="flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>
                      <span>Support:<span class="font-semibold">24 Months</span></span>
                  </li>
              </ul>
              <a onClick={()=>onPayClick(plans.personal.amount,'PERSONAL')} class="text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:ring-primary-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center bg-blue-700 dark:text-white  dark:focus:ring-primary-900">{membership.planType==='PERSONAL' ? 'CURRENT PLAN':'BUY'}</a>
          </div>
          {/* <!-- Pricing Card --> */}
          <div class="flex flex-col p-6 mx-auto max-w-lg text-center text-gray-900 bg-white rounded-lg border border-gray-100 shadow dark:border-gray-600 xl:p-8 dark:bg-gray-800 dark:text-white">
              <h3 class="mb-4 text-2xl font-semibold">Pro</h3>
              <p class="font-light text-gray-500 sm:text-lg dark:text-gray-400">Best for large scale uses and all features of the product</p>
              <div class="flex justify-center items-baseline my-8">
                  <span class="mr-2 text-5xl font-extrabold">{plans.pro.formatedAmount}</span>
                  <span class="text-gray-500 dark:text-gray-400">/year</span>
              </div>
              {/* <!-- List --> */}
              <ul role="list" class="mb-8 space-y-4 text-left">
                  <li class="flex items-center space-x-3">
                  <svg class="flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>
                    
                 <span>Unlimited Links </span>
                  </li>
                  <li class="flex items-center space-x-3">
                  <svg class="flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>
                      <span>Password Protected Links</span>
                  </li>
                  <li class="flex items-center space-x-3">
                    
                  <svg class="flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>
                     <span>Bio Links</span>
                  </li>
                  <li class="flex items-center space-x-3">
                  <svg class="flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>
                     <span>Developer API's </span>
                  </li>
                  <li class="flex items-center space-x-3">
                      <svg class="flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>
                      <span>Support:<span class="font-semibold">24 Months</span></span>
                  </li>
              </ul>
              <a  onClick={()=>onPayClick(plans.pro.amount,'PRO')} class="text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:ring-primary-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center bg-blue-700 dark:text-white  dark:focus:ring-primary-900">{membership.planType==='PRO' ? 'CURRENT PLAN':'BUY'}</a>
          </div>
      </div>
  </div>
    </section>

    {
        paymentDetails &&
        <div className='flex flex-col pl-10'>
            
            <span className='font-bold text-xl' >Last Payment Details:</span>
            <span className='text-l' >Plan Type: <span className='font-bold text-l'>{membership.planType}</span> </span>
            <span className='text-l'>Method : <span className='font-bold text-l'>{paymentDetails.method}</span></span>
            <span className='text-l'> Amount Paid : <span className='font-bold text-l'>{formatAmount(paymentDetails.amount/100)}</span></span>
            <span className='text-l'>Purchase Date: <span className='font-bold text-l'>{membership.planStarted}</span></span>
            <span className='text-l'>Expiry Date: <span className='font-bold text-l'> {membership.planExpiry}</span></span>
        </div>
    }
    </div>
  )
}
