import React, { useState, useEffect } from 'react';
import { Button, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel } from '@mui/material';
import swal from 'sweetalert';
// import './ExamPage.css';
import { useHistory } from "react-router-dom";

export default function QuestionPage({question}) {
  const history = useHistory();

  const [student_name] = useState('Student');
  const [exam_id] = useState('2fqdS');
  const [selectedOption, setSelectedOption] = useState('');
  
  const handleSubmit = () => {
    swal("Thank You for taking the exam. Your answers have been recorded.");
    history.push('/dashboard');
  };

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };



  return (
    <div style={{ height: "100%", width: "100%", backgroundColor: 'white', color: 'black', padding: '20px',marginRight:'10px'}}>

      {/* Detection Component (Optional) */}
      {/* <Detection ...props /> */}
{/* 
      <div className="name">
        <h6 style={{ fontSize: '20px' , color: 'black' }}  align="left">Name: <span style={{ fontSize: '20px' , color: 'black' }}>{student_name}</span></h6>
        <h6 style={{ fontSize: '20px' , color: 'black' }} align="left">Exam ID: <span style={{ fontSize: '20px' ,color: 'black' }}>{exam_id}</span></h6>
      </div> */}


      <div className="question-area" style={{}}>
        <FormControl component="fieldset">
          <FormLabel component="legend" style={{ color: 'black', fontSize: '20px' }}>
            Q{question.questionNumber+1} {" "} {question.questionTitle}
          </FormLabel>
          {
            question.type === 'MCQ' ? (
                <RadioGroup
                    aria-label="question1"
                    name="question1"
                    value={selectedOption}
                    onChange={handleOptionChange}
                    style={{ marginTop: '20px' }}
                >
                    <FormControlLabel value="paris" control={<Radio style={{ color: 'black' }} />} label="Paris" />
                    <FormControlLabel value="berlin" control={<Radio style={{ color: 'black' }} />} label="Berlin" />
                    <FormControlLabel value="rome" control={<Radio style={{ color: 'black' }} />} label="Rome" />
                    <FormControlLabel value="madrid" control={<Radio style={{ color: 'black' }} />} label="Madrid" />
                </RadioGroup>
            ) :
            (
                <div>
                    <input
                        type="text"
                        placeholder="________"
                        className="border-b-2 border-black focus:outline-none px-2 w-32 text-center"
                    />.
                </div>
            )
          }
        </FormControl>
      </div>

    </div>
  );
}

