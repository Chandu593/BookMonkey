import React from 'react'
import '../Global.css'
import { IconButton, Typography } from '@mui/material'
import FacebookIcon from '@mui/icons-material/Facebook';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import XIcon from '@mui/icons-material/X';
import { NavLink } from 'react-router-dom';
function Footer() {
	return (
		<>
			<footer className="footer">
				<div className="container">
					<div className="row">
						<div className="footer-col">
							<h4>company</h4>
							<ul>
								<li><a href="/">about us</a></li>
								<li><a href="/">our services</a></li>
								<li><a href="/">privacy policy</a></li>
								<li><a href="/">affiliate program</a></li>
							</ul>
						</div>
						<div className="footer-col">
							<h4>get help</h4>
							<ul>
								<li><a href="/">FAQ</a></li>
								<li><a href="/">shipping</a></li>
								<li><a href="/">returns</a></li>
								<li><a href="/">order status</a></li>
								<li><a href="/">payment options</a></li>
							</ul>
						</div>
						<div className="footer-col">
							<h4>online shop</h4>
							<ul>
								<li><NavLink to='/'>Novels</NavLink></li>
								<li><NavLink to='/'>Poetry</NavLink></li>
								<li><NavLink to='/'>Fictional Books</NavLink></li>
								<li><NavLink to='/'>Story Books</NavLink></li>
							</ul>
						</div>
						<div className="footer-col">
							<h4>follow us</h4>
							<div className="social-links">
								<IconButton ><FacebookIcon sx={{ fontSize: 35, color: 'white', marginInline: 0.2 }} /></IconButton>
								<IconButton ><LinkedInIcon sx={{ fontSize: 35, color: 'white', marginInline: 0.2 }} /></IconButton>
								<IconButton ><WhatsAppIcon sx={{ fontSize: 35, color: 'white', marginInline: 0.2 }} /></IconButton>
								<IconButton ><XIcon sx={{ fontSize: 33, color: 'white', marginInline: 0.2 }} /></IconButton>
							</div>
						</div>
					</div>
				</div>
				<Typography variant='subtitle1' sx={{ color: '#bbbbbb',width:'100%',textAlign:'center',marginBottom:-6,marginTop:2 }}><b>All rights reserved|Copyright&copy;2024,INC</b></Typography>
			</footer>
		</>
	)
}

export default React.memo(Footer);
