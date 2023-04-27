import React, { useState } from 'react';
import { Contact } from './PhoneBookList';

interface PhoneBookFormProps {
  contact?: Contact;
  onSubmit: (contact: Contact) => void;
  onCloseModal: () => void;
}

const PhoneBookForm: React.FC<PhoneBookFormProps> = ({ onSubmit, onCloseModal, contact }) => {
  const [firstName, setFirstName] = useState(contact?.firstName || "");
  const [lastName, setLastName] = useState(contact?.lastName || "");
  const [phoneNumber, setPhoneNumber] = useState(contact?.phoneNumber || "");

  async  function handleSubmit(event: React.FormEvent){
     event.preventDefault();
   
    const newContact = {id: contact?.id, firstName: firstName, lastName: lastName, phoneNumber: phoneNumber}      
    setFirstName('');
    setLastName('');
    setPhoneNumber('');
    onSubmit(newContact);
  };

  function onClose(){
    setFirstName('');
    setLastName('');
    setPhoneNumber('');
    onCloseModal();
  }

  return (
  <div className='fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75'>
    <div className='bg-white w-96 rounded-lg p-8'>
      <h2 className='text-2x1 font-bold mb-4'>Add Contact</h2>
      <form onSubmit={handleSubmit} className='flex flex-col'>
          <input
            placeholder='First Name'
            className='w-full p-2 mb-4 rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500'
            type="text"
            id="firstName"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <input
            placeholder='Last name'
            type="text"
            id="lastName"
            className='w-full p-2 mb-4 rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500'
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
          <input
            placeholder='Phone'
            type="number"
            id="phoneNumber"
            className='w-full p-2 mb-4 rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500'
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
          <div className='flex justify-end'>
          <button type="button" 
                  onClick={onClose}
                  className="bg-gray-200 text-gray-700 px-4 py-2 mr-2 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 ">
           Close</button>
           <button type="submit" 
                  className="bg-blue-500 text-white px-4 py-2 mr- rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 ">
           { !contact ? "Add Contact" : "Update Contact" }</button>
           </div>
        </form>
      </div>
    </div>
  );
};

export default PhoneBookForm;