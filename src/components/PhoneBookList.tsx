import React, { useEffect, useState } from 'react';
import PhoneBookForm from './PhoneBookForm';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import { TrashIcon, PencilIcon, PlusIcon  } from '@heroicons/react/solid';

export interface Contact {
  id?: number;
  firstName: string;
  lastName: string;
  phoneNumber: string;
}

const API_URL = 'http://localhost:5000/api/contacts';

const PhoneBookList: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [tableData, setTableData] = useState<Contact[]>([]);
  const [showModalContact, setShowModalContact] = useState<Boolean>(false);
  const [editcontact, setEditContact] = useState<Contact>();
 
  function handleSearch(e: React.ChangeEvent<HTMLInputElement>){
    setSearchQuery(e.target.value);
  }

  const filteredTableData = tableData.filter((row) => row.lastName.toLowerCase().includes(searchQuery.toLowerCase()));

  async function handleAddRow(contact: Contact){
    const newRowId = Math.max(...tableData.map(row => row.id!!)) + 1;
    const newcontact: Contact = { id: newRowId, 
      firstName: contact.firstName,
      lastName: contact.lastName,
      phoneNumber: contact.phoneNumber};
    
     try {
      await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify( newcontact ),
      });
      refreshContacts();
      toast.success('Contact added successfully');
    } catch (error) {
      toast.error('Failed to add contact');
    }
    setShowModalContact(false);
  }

  async function refreshContacts() {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setTableData(data);
    } catch (error) {
      console.error('Error fetching contacts:', error);
    }
  };
  
  useEffect(() => {
    refreshContacts();
  }, []);

  async function onRemove(contact: Contact){
    try {
        await fetch(`${API_URL}/${contact.id}`, {
        method: 'DELETE',
      });
      refreshContacts();
      toast.success('Contact removed successfully');
    } catch (error) {
      toast.error('Failed to remove contact');
    }
  };
  
  async function handleUpdateRow(contact: Contact){
     try {
      await fetch(`${API_URL}/${contact.id}`, {
        method: 'put',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify( contact ),
      });
      refreshContacts();
      toast.success('Contact updated successfully');
    } catch (error) {
      toast.error('Failed to updated contact');
    }
    setShowModalContact(false);
  }


  return (
    <div className="flex flex-col w-full h-full px-4 pb-16 justify-center items-center bg-gray-50">
      <div className=" flex flex-col w-[80%] h-full justify-center items-center px-4 pb-16">
      <h1 className='p-16'>Phone Book App</h1>
      <div className="flex flex-col w-full pb-16">
        <div className='flex mb-8 justify-between'>
          <span>Contacts</span>
          <button
            className="flex items-center justify-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            onClick={() => {
              setEditContact(undefined);
              setShowModalContact(true);
            }}
          >
            <PlusIcon className="h-4 w-5 mr-2" />
            Add Contact
          </button>
        </div>
        <input
          type="text"
          placeholder="Search for contact by last name..."
          className="px-4 py-2 border border-gray-300 rounded-md w-full w-min-64"
          value={searchQuery}
          onChange={handleSearch}
        />
      </div>
      <div className="w-full overflow-x-auto ">
        <table className="w-full table-fixed border">
          <tbody>
            {filteredTableData.map(row => (
              <tr key={row.id}>
                <td  className="flex flex-row border-t bg-white w-full text-gray-700 items-center justify-between ">
                  <div className='flex flex-col px-4 py-2'>
                    <span><strong>{row.firstName} {row.lastName}</strong></span>
                    <span>{row.phoneNumber}</span>
                  </div>
                  <div className='p-4'>
                  <button 
                      className="mr-2 bg-green-500 hover:bg-green-600 text-white hover:text-blue-700 focus:outline-none py-2 px-3 rounded"
                      onClick={() => {
                        setEditContact(row);
                        setShowModalContact(true); 
                        }} ><PencilIcon className="h-5 w-5"/>
                    </button>
                    <button 
                      className="bg-red-500 hover:bg-red-600 text-white py-2 px-3 rounded"
                      onClick={() => {
                        onRemove(row); 
                        }} > <TrashIcon className="h-5 w-5 bg-red" />
                    </button>
                  </div>
                </td>
              </tr>
          ))}
          </tbody>
        </table>
      </div>
      {showModalContact &&
        <PhoneBookForm 
          contact={editcontact}
          onSubmit={!editcontact ? handleAddRow : handleUpdateRow} 
          onCloseModal={() => setShowModalContact(false)} />
      }
      <ToastContainer/>
      </div>
    </div>
  );
};

export default PhoneBookList;