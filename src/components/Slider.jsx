import React, { useEffect, useState } from 'react'
import { db } from '../firebase'
import { collection, getDocs, limit, orderBy, query } from 'firebase/firestore'
import Spinner from '../components/Spinner';
import {Swiper, SwiperSlide} from 'swiper/react';
import  {EffectFade, Autoplay, Navigation, Pagination} from 'swiper/modules';
import "swiper/css/bundle"
import { useNavigate } from 'react-router';


function Slider() {
  const [listings, setListings] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate =  useNavigate();
  useEffect(()=>{
    async function fetchListings(){
      const listingsRef = collection(db, "listings")
      const q = query(listingsRef, orderBy("timestamp", "desc"),limit(5));
      const querySnap = await getDocs(q)
      let listings = [];
      querySnap.forEach((doc)=>{
        return listings.push({
          id: doc.id,
          data: doc.data(),
        });
      });
      setListings(listings);
      setLoading(false)

    }
    fetchListings()

  },[]);
  if(loading){
    return <Spinner/>
  }
  if(listings.length === 0){
    return  <> </>  ; 
  }
  return (
  listings && (
  <>
  <Swiper
  modules={[Navigation, Pagination, EffectFade,Autoplay]} slidesPerView={1}  pagination={{type:'progressbar'}}
  effect='fade' 
  autoplay={{delay:3000,disableOnInteraction:false}}
  >
  {listings.map(({data, id})=>(
   <SwiperSlide key={id} onClick={()=>navigate(`/category/${data.type}/${id}`)}>
    <div style={{background: `url(${data.imgUrls[0]}) center, no-repeat`,backgroundSize: "cover"}}
    className='relative w-full h-[300px] overflow-hidden'
    >

    </div>
    <p className='text-[#f1faee] absolute left-1 top-1 font-medium max-w-[90%] bg-[#457b9d]  shadow-lg opacity-90 p-2 rounded-br-3xl'>
    {data.name}
    </p>
    <p className='text-[#f1faee] absolute left-1 bottom-1 font-semibold max-w-[90%] bg-[#457b9d] bg-[#e63946] shadow-lg opacity-90 p-2 rounded-tr-3xl'>
    ₹{data.discountedPrice ?? data.regularPrice}
      {data.type === "rent" && '/ month'}
    </p>

   </SwiperSlide>
  ))}
  </Swiper>
  </>
  )
);
}

export default Slider