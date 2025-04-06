// import React , { useState } from 'react'
// import TextField from '@mui/material/TextField';
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
// import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';



// function CreateExam() {
//    const [questionCount , setQuestionCount] = useState(0) ; 
//    const [name , setName] = useState("") ; 
//    const [date_time_start, setDateTimeStart] = useState(new Date());
//    const [duration, setDuration] = useState(0);
//    const [questions , setQuestions] = useState([]) ; 

//   return (
//     <div>
//         <div>
//         <TextField
//                   autoFocus
//                   padding="10px"
//                   margin="dense"
//                   variant="standard"
//                   id="name"
//                   label="Exam Name"
//                   type="text"
//                   fullWidth
//                   required={true}
//                   value={questionCount}
//                   onChange={(e)=> setQuestionCount(e.target.value)}
//               />
//               <TextField
//                   autoFocus
//                   padding="10px"
//                   margin="dense"
//                   variant="standard"
//                   id="name"
//                   label="Exam Name"
//                   type="text"
//                   fullWidth
//                   required={true}
//                   value={name}
//                   onChange={(e)=>setName(e.target.value)}
//               />

//             <LocalizationProvider dateAdapter={AdapterDateFns}>
//                   <DateTimePicker
//                     label="Start Date & Time"
//                     value={date_time_start}
//                     onChange={(newValue) => setDateTimeStart(newValue)}
//                     slotProps={{
//                       textField: {
//                         variant: 'standard',
//                         fullWidth: true,
//                         margin: 'dense'
//                       }
//                     }}
//                   />
//             </LocalizationProvider>
//             <TextField
//                   id="duration"
//                   name="duration"
//                   label="Exam duration (minutes)"
//                   margin="dense"
//                   variant="standard"
//                   value={duration}
//                   onChange={(e)=> setDuration(e.target.value)}
//                   required={true}
//                   minDate={new Date()}
//                   minTime={new Date(0, 0, 0, 8)}
//             />



//         </div>
//     </div>
//   )
// }

// export default CreateExam


import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import Button from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';


function CreateExam({submitQuestion , closeExamDialog , createExam}) {
  const [questionCount, setQuestionCount] = useState(0);
  const [name, setName] = useState('');
  const [date_time_start, setDateTimeStart] = useState(new Date());
  const [duration, setDuration] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [exam_code, setExamCode] = useState("");

  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index] = {
      ...updatedQuestions[index],
      [field]: value,
    };
    setQuestions(updatedQuestions);
  };

  function generateCode(){
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    var length = 5;
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * 
        charactersLength));
    }
    setExamCode(result);
    navigator.clipboard.writeText(result);
}

  const handleOptionChange = (index, optionIndex, value) => {
    const updatedQuestions = [...questions];
    const options = updatedQuestions[index]?.options || [];
    options[optionIndex] = value;
    updatedQuestions[index] = {
      ...updatedQuestions[index],
      options,
    };
    setQuestions(updatedQuestions);
  };

  const handleQuestionTypeChange = (index, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index] = {
      ...updatedQuestions[index],
      type: value,
      options: value === 'MCQ' ? ['', '', '', ''] : [],
    };
    setQuestions(updatedQuestions);
  };

  return (
    <div style={{ padding: '24px', maxWidth: '900px', margin: '0 auto' }}>
      <TextField
        label="Number of Questions"
        type="number"
        variant="standard"
        fullWidth
        margin="normal"
        value={questionCount}
        onChange={(e) => {
          const count = parseInt(e.target.value, 10);
          setQuestionCount(count);
          const newQuestions = Array.from({ length: count }, (_, i) => questions[i] || {});
          setQuestions(newQuestions);
        }}
      />

      <TextField
        label="Exam Name"
        type="text"
        variant="standard"
        fullWidth
        margin="normal"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DateTimePicker
          label="Start Date & Time"
          value={date_time_start}
          onChange={(newValue) => setDateTimeStart(newValue)}
          slotProps={{
            textField: {
              variant: 'standard',
              fullWidth: true,
              margin: 'normal',
            },
          }}
        />
      </LocalizationProvider>

      <TextField
        label="Exam Duration (minutes)"
        type="number"
        variant="standard"
        fullWidth
        margin="normal"
        value={duration}
        onChange={(e) => setDuration(e.target.value)}
      />

      {questions.map((q, idx) => (
        <div
          key={idx}
          style={{
            border: '1px solid #ccc',
            padding: '16px',
            marginTop: '24px',
            borderRadius: '8px',
            backgroundColor: '#f9f9f9',
          }}
        >
          <h3>Question {idx + 1}</h3>

          <TextField
            label="Question"
            fullWidth
            variant="standard"
            margin="dense"
            value={q.question || ''}
            onChange={(e) => handleQuestionChange(idx, 'question', e.target.value)}
          />

          <TextField
            label="Marks"
            fullWidth
            variant="standard"
            type="number"
            margin="dense"
            value={q.marks || ''}
            onChange={(e) => handleQuestionChange(idx, 'marks', e.target.value)}
          />

          <TextField
            label="Type (MCQ or fillInBlanks)"
            fullWidth
            variant="standard"
            margin="dense"
            value={q.type || ''}
            onChange={(e) => handleQuestionTypeChange(idx, e.target.value)}
          />

          {q.type === 'MCQ' && (
            <div>
              {q.options?.map((option, i) => (
                <TextField
                  key={i}
                  label={`Option ${i + 1}`}
                  fullWidth
                  variant="standard"
                  margin="dense"
                  value={option}
                  onChange={(e) => handleOptionChange(idx, i, e.target.value)}
                />
              ))}

              <TextField
                label="Correct Answer"
                fullWidth
                variant="standard"
                margin="dense"
                value={q.correctAnswer || ''}
                onChange={(e) => handleQuestionChange(idx, 'correctAnswer', e.target.value)}
              />
            </div>
          )}

          {q.type === 'fillInBlanks' && (
            <TextField
              label="Correct Answer"
              fullWidth
              variant="standard"
              margin="dense"
              value={q.correctAnswer || ''}
              onChange={(e) => handleQuestionChange(idx, 'correctAnswer', e.target.value)}
            />
          )}
        </div>
      ))}

        <TextField
            id="exam_code"
            name="exam_code"
            label="Exam Code"
            margin="dense"
            variant="standard"
            value={exam_code}
            disabled={true}
            onChange={(e)=> setExamCode(e.target.value)}
            required={true}
            fullWidth
        />
        <Button onClick={generateCode}>Generate Exam Code</Button>

        <DialogActions>
              <Button onClick={closeExamDialog} color="secondary">
                  Close
              </Button>
              <Button onClick={() => {
                createExam({
                    questionCount , 
                    name , 
                    date_time_start ,
                    duration , 
                    questions ,
                    exam_code ,
                })
              }} color="primary">
                  Save
              </Button>
        </DialogActions>
    </div>
  );
}

export default CreateExam;
