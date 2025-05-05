import React, { useContext } from 'react';
import Card from './Card'
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
import '../Global.css'
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Pagination, Navigation } from 'swiper/modules';
import { Box, Button, Skeleton, Tooltip, Typography } from '@mui/material';
import EastIcon from '@mui/icons-material/East';
import Loaderr from './Loaderr';
import { context } from '../App';
import { NavLink } from 'react-router-dom';
function Carousel1(props) {
  const { data, isloading,setSelectedFilters } = useContext(context);
  const languages = [{ name: 'tel', localname: 'తెలుగు', fullname: 'Telugu' },
  { name: 'hin', localname: 'हिन्दी ', fullname: 'Hindi' },
  { name: 'tam', localname: 'தமிழ்', fullname: 'Tamil' },
  { name: 'mal', localname: 'മലയാളി', fullname: 'Malayalam' },
  { name: 'kan', localname: 'ಕನ್ನಡ', fullname: 'Kannada' },
  { name: 'eng', localname: 'English', fullname: 'English' },
  { name: 'mar', localname: 'मराठी', fullname: 'Marathi' }];
const handleLanguageChange=(lang)=>{
  setSelectedFilters(prev=>{
    return {
      ...prev,language:lang
    }
  })
}
  return (
    <>
      {props.for === 'books' ? <Box component='div'className='animate' sx={{ padding: 4, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <Typography variant='h4' sx={{ fontSize: { xs: 23, sm: 33 }, fontWeight: 700, marginY: 2, fontFamily: 'FlechaM' }}>Top Picks</Typography>
        {!data.length && !isloading ? <iframe width={300} height={300} title='book not found' src="https://lottie.host/embed/3acd255f-9b7b-4df1-9dbd-5610c70ed75b/AJXKsZJ4Ur.lottie" /> : isloading ? <Loaderr /> : <Swiper
          spaceBetween={20}
          slidesPerView={2}
          navigation={true}
          modules={[Pagination, Navigation]}
          breakpoints={{
            640: {
              slidesPerView: 3,
            },
            980: {
              slidesPerView: 4,
            },
            1024: {
              slidesPerView: 5,
            },
            1280: {
              slidesPerView: 6,
            },
          }}
        >
          {data.slice(0,15).map((element) => {
            return (
              <SwiperSlide key={Math.random()}>
                <Card
                  coverPhotoUrl={element.coverPhotoUrl||'https://tse4.mm.bing.net/th?id=OIP.kbe_yOW8nUXbkwms-0fr3wHaKG&pid=Api&P=0&h=180'}
                  author={element.author||'Unknown author'}
                  avgrating={element.avgrating}
                  title={element.title || 'Untitled'}
                  price={element.price}
                  isbn={element.isbn}
                  quantity={1}
                  isaddedtocart={false}
                />
              </SwiperSlide>
            );
          })}
        </Swiper>}
        {data.length && (isloading ? <Skeleton animation='wave' variant="rounded" sx={{ width: '160px', height: '45px', borderRadius: 15, backgroundColor: '#ebe5e5' }} />
          : <NavLink to='/bookpage'><Button
            variant='contained'
            size='large'
            endIcon={<EastIcon />}
            sx={{
              fontSize: { xs: 15, sm: 17 },
              borderRadius: 10,
              backgroundImage: 'linear-gradient(to right, #EB1165 , #FF6347)',
              marginY: 2
            }}
          >
            View More
          </Button></NavLink>
        )}
      </Box> : <Box component='div'className='animate' sx={{ padding: 4, paddingY: 6, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: '#f0f0f0' }}>
        <Typography variant='h4' sx={{ fontSize: { xs: 23, sm: 33 }, fontWeight: 700, fontFamily: 'FlechaM', marginBottom: 1 }}>Read books in your mother tongue</Typography>
        <Swiper
          spaceBetween={20}
          slidesPerView={2}
          navigation={true}
          modules={[Pagination, Navigation]}
          breakpoints={{
            640: {
              slidesPerView: 3,
            },
            980: {
              slidesPerView: 4,
            },
            1024: {
              slidesPerView: 5,
            },
            1280: {
              slidesPerView: 6,
            },
          }}
        >
          {
            languages.map((element) => {

              return <SwiperSlide className='languagebox' key={element.name} onClick={() => handleLanguageChange(element.fullname)}><Tooltip title={element.fullname} placement='top' arrow><NavLink className='navlink' to='/bookpage'>
                <Box sx={{ fontWeight: 700, display: 'flex', justifyContent: 'center', alignItems: 'center', height: { xs: '200px', sm: '220px' }, borderRadius: 4, background: 'url(https://tse3.mm.bing.net/th?id=OIP.YhKNRyR8rliFuZ3aALoQiAHaDe&pid=Api&P=0&h=180) no-repeat center center/cover', color: 'white' }}>
                  <Typography variant='h4'>{element.localname}</Typography>
                </Box>
              </NavLink></Tooltip></SwiperSlide>
            })
          }
        </Swiper></Box>}
    </>
  );
}
export default React.memo(Carousel1)