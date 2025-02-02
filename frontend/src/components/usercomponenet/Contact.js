import React, { useEffect, useRef, useState } from 'react'
import emailjs from '@emailjs/browser';
const Contact = () => {
  const form = useRef();
  const sendEmail = (e) => {
    e.preventDefault();

    emailjs
      .sendForm("service_xnxxtog", "template_phitb9y", form.current, "gTxw6jLYP9gq03_Y_")
      .then(
        () => {
          alert("Email Send SUCCESSFULLY");
        },
        (error) => {
          alert("FAILED to send eamil");
        },
      );
  };
  return (
    <div style={{
      position: "absolute", top: "20vmin", width: "100%", height: "80vh", display: "flex", alignItems: "center", justifyContent: "center", backgroundImage: `url("https://media.istockphoto.com/id/589415708/photo/fresh-fruits-and-vegetables.jpg?s=612x612&w=0&k=20&c=aBFGUU-98pnoht73co8r2TZIKF3MDtBBu9KSxtxK_C0=")`,
      backgroundRepeat: "no-repeat", backgroundSize: "cover"
    }}>
      <div className="contact">
        <h2>Contact</h2>
        <form className="contact-form" ref={form} onSubmit={sendEmail}>
          <input type="text" placeholder="Your Name" name="from_name" required />
          <input type="email" placeholder="Your Email" name="from_email" required />
          <textarea placeholder="Your Message" required name='message'></textarea>
          <button type="submit" className="btn">Send Message</button>
        </form>
      </div>
    </div>
  )
}

export default Contact