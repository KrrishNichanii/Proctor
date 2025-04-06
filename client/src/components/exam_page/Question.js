// import React, { useState, useEffect } from 'react';
// import { Button, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel } from '@mui/material';
// import swal from 'sweetalert';
// // import './ExamPage.css';
// import { useHistory } from "react-router-dom";

// export default function QuestionPage({question}) {
//   const history = useHistory();

//   const [student_name] = useState('Student');
//   const [exam_id] = useState('2fqdS');
//   const [selectedOption, setSelectedOption] = useState('');
  
//   const handleSubmit = () => {
//     swal("Thank You for taking the exam. Your answers have been recorded.");
//     history.push('/dashboard');
//   };

//   const handleOptionChange = (event) => {
//     setSelectedOption(event.target.value);
//   };



//   return (
//     <div style={{ height: "100%", width: "100%", backgroundColor: 'white', color: 'black', padding: '20px',marginRight:'10px'}}>

//       {/* Detection Component (Optional) */}
//       {/* <Detection ...props /> */}
// {/* 
//       <div className="name">
//         <h6 style={{ fontSize: '20px' , color: 'black' }}  align="left">Name: <span style={{ fontSize: '20px' , color: 'black' }}>{student_name}</span></h6>
//         <h6 style={{ fontSize: '20px' , color: 'black' }} align="left">Exam ID: <span style={{ fontSize: '20px' ,color: 'black' }}>{exam_id}</span></h6>
//       </div> */}


//       <div className="question-area" style={{}}>
//         <FormControl component="fieldset">
//           <FormLabel component="legend" style={{ color: 'black', fontSize: '20px' }}>
//             Q{question.questionNumber+1} {" "} {question.questionTitle}
//           </FormLabel>
//           {
//             question.type === 'MCQ' ? (
//                 <RadioGroup
//                     aria-label="question1"
//                     name="question1"
//                     value={selectedOption}
//                     onChange={handleOptionChange}
//                     style={{ marginTop: '20px' }}
//                 >
//                     <FormControlLabel value="paris" control={<Radio style={{ color: 'black' }} />} label="Paris" />
//                     <FormControlLabel value="berlin" control={<Radio style={{ color: 'black' }} />} label="Berlin" />
//                     <FormControlLabel value="rome" control={<Radio style={{ color: 'black' }} />} label="Rome" />
//                     <FormControlLabel value="madrid" control={<Radio style={{ color: 'black' }} />} label="Madrid" />
//                 </RadioGroup>
//             ) :
//             (
//                 <div>
//                     <input
//                         type="text"
//                         placeholder="________"
//                         className="border-b-2 border-black focus:outline-none px-2 w-32 text-center"
//                     />.
//                 </div>
//             )
//           }
//         </FormControl>
//       </div>

//     </div>
//   );
// }




/////////////////////////////////////////////////////////////////////////////////////////////////


import React, { useState, useEffect } from 'react';
import { Button, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel } from '@mui/material';
import swal from 'sweetalert';
// import './ExamPage.css';
import { useHistory } from "react-router-dom";

export default function QuestionPage({ question, onAnswerChange, userAnswer }) {
  const history = useHistory();
  const [selectedOption, setSelectedOption] = useState(userAnswer || '');
  const [textAnswer, setTextAnswer] = useState(userAnswer || '');
  
  // Update parent component when answer changes
  useEffect(() => {
    if (question.type === 'MCQ' && selectedOption) {
      onAnswerChange && onAnswerChange(selectedOption);
    } else if (question.type === 'fillInBlanks' && textAnswer) {
      onAnswerChange && onAnswerChange(textAnswer);
    }
  }, [selectedOption, textAnswer, onAnswerChange, question.type]);

  const handleSubmit = () => {
    swal("Thank You for taking the exam. Your answers have been recorded.");
    history.push('/dashboard');
  };

  const handleOptionChange = (event) => {
    const value = event.target.value;
    setSelectedOption(value);
    // Call onAnswerChange directly to ensure immediate update
    if (onAnswerChange) onAnswerChange(value);
  };

  const handleTextChange = (event) => {
    const value = event.target.value;
    setTextAnswer(value);
    // Call onAnswerChange directly to ensure immediate update
    if (onAnswerChange) onAnswerChange(value);
  };

  return (
    <div className="question-container" style={{ 
      padding: '25px', 
      marginBottom: '30px', 
      backgroundColor: 'white',
      position: 'relative'
    }}>
      <div className="question-number" style={{
        position: 'absolute',
        top: '15px',
        right: '15px',
        background: 'linear-gradient(135deg, #3f51b5, #2196f3)',
        color: 'white',
        width: '35px',
        height: '35px',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 'bold',
        fontSize: '16px',
        boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
      }}>
        {question.questionNumber+1}
      </div>
      
      <FormControl component="fieldset" style={{ width: '100%' }}>
        <FormLabel component="legend" style={{ 
          color: '#333', 
          fontSize: '20px', 
          fontWeight: '600',
          marginBottom: '20px',
          fontFamily: 'Arial, sans-serif',
          lineHeight: '1.4'
        }}>
          {question.questionTitle}
          <span style={{ 
            fontSize: '14px', 
            color: '#666', 
            fontWeight: 'normal', 
            marginLeft: '10px',
            backgroundColor: '#f0f4ff',
            padding: '3px 8px',
            borderRadius: '12px'
          }}>
            {question.marks} mark{question.marks > 1 ? 's' : ''}
          </span>
        </FormLabel>
        
        {question.type === 'MCQ' ? (
          <RadioGroup
            aria-label={`question-${question.questionNumber}`}
            name={`question-${question.questionNumber}`}
            value={selectedOption}
            onChange={handleOptionChange}
            style={{ marginTop: '20px' }}
          >
            {question.options.map((option, index) => (
              <FormControlLabel 
                key={index}
                value={option} 
                control={<Radio />} 
                label={<span style={{ fontSize: '16px' }}>{option}</span>}
                className="option-label"
              />
            ))}
          </RadioGroup>
        ) : (
          <div style={{ marginTop: '20px' }}>
            <input
              type="text"
              placeholder="Type your answer here..."
              className="answer-input"
              value={textAnswer}
              onChange={handleTextChange}
            />
          </div>
        )}
      </FormControl>
    </div>
  );
}