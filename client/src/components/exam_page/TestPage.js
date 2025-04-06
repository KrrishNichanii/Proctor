
import React from 'react';
import { useState, useEffect } from 'react';
import Detection from './Object_Detection';
import { Button } from '@mui/material';
import swal from 'sweetalert';
import "./ExamPage.css";
import { Redirect, useHistory } from "react-router-dom";
import axios from 'axios';
import QuestionPage from './Question';



export default function TestPage(props){
  const [cameraStream, setCameraStream] = useState(null);
  const [exam_id, setExamId] = useState(props.location.state?.exam_code || '2fqdS');
  const [student_name, setStudentName] = useState(props.location.state?.student_name || 'Student');
  const [student_email, setStudentEmail] = useState(props.location.state?.student_email || 'abc@gmail.com');
  // const [exam_id, setExamId] = useState(props.location.state?.exam_code ||  '2fqdS');
  const [form_link, setFormLink] = useState(props.location.state?.exam_link || 'https://docs.google.com/forms/d/e/1FAIpQLSeCg8BgoYjdz6FJEFl0wzShHnPN8xyOIkm04MIJvMHZo2Od0Q/viewform?usp=header');
  const [minutes, setMinutes] = useState(parseInt(props.location?.state?.mins_left) || '129');
  const [seconds, setSeconds] = useState(parseInt(props.location?.state?.secs_left) || '123');
  const [tab_change, setTabChange] = useState(0);
  const [key_press, setKeyPress] = useState(0);
  const [full_screen_exit, setFullScreenExit] = useState(0);
  const [mobile_phone_found, setMobilePhoneFound] = useState(false);
  const [prohibited_object_found, setProhibitedObjectFound] = useState(false);
  const [face_not_visible, setFaceNotVisible] = useState(false);
  const [multiple_faces_visible, setMultipleFacesVisible] = useState(false);
  const [checkedPrevLogs, setCheckedPrevLogs] = useState(false);
  const [answers, setAnswers] = useState({});
  const [totalScore, setTotalScore] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  // const [exam , setExam] = useState({}) ; 
  const [questionCount , setQuestionCount] = useState(0) ; 
  const history = useHistory();

  const exam = {
    name: "DC End Sem" , 
    professor_email: "abc@gmail.com" , 
    exam_code: "2fqdS" , 
    questions: [
      {
        type: "MCQ",
        questionTitle: "What is the full form of DC?",
        options: [
          "Distributed Computing",
          "Disk Computing",
          "Dhage Computing",
          "Daksh Computing"
        ],
        marks: 1,
        correctAnswer: "Distributed Computing" 
      },
      {
        type: "fillInBlanks",
        questionTitle: "____________ is the principal technique used to achieve fault tolerance in a distributed system.",
        correctAnswer: "Replication",
        marks: 1 , 
        hidden: true
      },
      {
        type: "MCQ",
        questionTitle: "Which of the following is NOT a characteristic of distributed systems?",
        options: [
          "Resource sharing",
          "Openness",
          "Centralized control",
          "Scalability"
        ],
        marks: 2,
        correctAnswer: "Centralized control"
      },
      {
        type: "MCQ",
        questionTitle: "Which of the following algorithms is used for clock synchronization in distributed systems?",
        options: [
          "Berkeley Algorithm",
          "Round Robin Algorithm",
          "Shortest Job First",
          "Banker's Algorithm"
        ],
        marks: 2,
        correctAnswer: "Berkeley Algorithm"
      },
      {
        type: "fillInBlanks",
        questionTitle: "____________ is a mechanism that helps processes to agree on a value in a distributed environment.",
        correctAnswer: "Consensus",
        marks: 2
      },
      {
        type: "MCQ",
        questionTitle: "Which type of transparency hides the process of resource relocation from the user?",
        options: [
          "Access transparency",
          "Migration transparency",
          "Relocation transparency",
          "Concurrency transparency"
        ],
        marks: 2,
        correctAnswer: "Relocation transparency"
      },
      {
        type: "MCQ",
        questionTitle: "Which of the following is NOT a challenge in distributed systems?",
        options: [
          "Heterogeneity",
          "Security",
          "Centralization",
          "Scalability"
        ],
        marks: 2,
        correctAnswer: "Centralization"
      },
      {
        type: "fillInBlanks",
        questionTitle: "A distributed system that appears to its users as a single computer system is said to have ____________.",
        correctAnswer: "Transparency",
        marks: 2
      },
      {
        type: "MCQ",
        questionTitle: "Google File System (GFS) is an example of:",
        options: [
          "Distributed File System",
          "Network File System",
          "Hierarchical File System",
          "Local File System"
        ],
        marks: 2,
        correctAnswer: "Distributed File System"
      },
      {
        type: "MCQ",
        questionTitle: "Which of the following protocols is used for clock synchronization in distributed systems?",
        options: [
          "Network Time Protocol (NTP)",
          "File Transfer Protocol (FTP)",
          "Simple Mail Transfer Protocol (SMTP)",
          "Hypertext Transfer Protocol (HTTP)"
        ],
        marks: 2,
        correctAnswer: "Network Time Protocol (NTP)"
      }
    ],
    max_marks: 50,
    date_time_start: "2025-04-05T06:00:00.000+00:00",
    duration: 20 
  }

  // const history = useHistory();
  
  
  // useEffect(() => {
  //   if (!exam_id) return;
  
  //   const fetchExam = async () => {
  //     try {
  //       const res = await axios.get(`/api/exams/${exam_id}`);
  //       setExam(res.data);
  //       setQuestionCount(res.data.questions.length || 0);
  //     } catch (error) {
  //       console.error("Failed to fetch exam:", error);
  //       swal("Error", "Unable to load the exam. Please try again later.", "error");
  //     }
  //   };
  
  //   fetchExam();
  // }, [exam_id]);
  // Update an answer when a question is answered
  const handleAnswerChange = (questionId, answer) => {
    console.log(`Answer changed for question ${questionId}: "${answer}"`);
    setAnswers(prevAnswers => {
      const newAnswers = {
        ...prevAnswers,
        [questionId]: answer
      };
      console.log("All answers:", newAnswers);
      return newAnswers;
    });
  };

  // Calculate the score based on the answers
  const calculateScore = () => {
    let score = 0;
    exam.questions.forEach((question, idx) => {
      const userAnswer = answers[idx];
      if (userAnswer === question.correctAnswer) {
        score += question.marks;
      }
    });
    setTotalScore(score);
    return score;
  };

  // Submit the exam to MongoDB
  const submitExam = () => {
    setIsSubmitting(true);
    const score = calculateScore();
    
    // Prepare answers for all questions, even unanswered ones
    const formattedAnswers = exam.questions.map((question, idx) => {
      const userAnswer = answers[idx] || '';
      return {
        question_number: idx + 1,
        question_title: question.questionTitle,
        student_answer: userAnswer,
        correct_answer: question.correctAnswer,
        marks: question.marks,
        is_correct: userAnswer === question.correctAnswer
      };
    });
    
    const examSubmission = {
      exam_code: exam_id,
      student_name: student_name,
      student_email: student_email,
      answers: formattedAnswers,
      total_score: score,
      max_score: exam.max_marks,
      submitted_at: new Date().toISOString(),
      time_taken: (exam.duration * 60) - (minutes * 60 + seconds)
    };

    // For development/testing, we'll simply show a success message
    // In production, uncomment the axios call to send data to the server
    
    // Mock submission success for development
    setIsSubmitting(false);
    swal({
      title: "Exam Submitted Successfully!",
      text: `Your score: ${score}/${exam.max_marks}`,
      icon: "success",
      button: "View Results",
    }).then(() => {
      stopCamera();
      history.push('/dashboard');
    });
    
  
  };

  useEffect(() => {
    let myInterval = setInterval(() => {
      if (seconds > 0) {
        setSeconds(seconds - 1);
      }
      else {
          setMinutes(minutes - 1);
          setSeconds(59);
        }

        if (minutes === 1 && seconds === 0) {
          swal("Only 1 Minute Left, Please Submit or attendance wont be marked");
        }

      if (seconds <= 0 && minutes <= 0) {
          submitExam(); // Auto-submit when time is up
        }
      sendLogsToServer();
  
    },1000);
    return () => {
      clearInterval(myInterval);
    };

  });
  /**
   * The below 4 functions are helper functions to set state
   * Are passed to the ObjectDetection component to allow it
   * to change state of its parent (This component)
   */

  
  function update_mobile_phone_found(){
    setMobilePhoneFound(true);
  }
  function update_prohibited_object_found(){
    setProhibitedObjectFound(true);
  }
  function update_face_not_visible(){
    setFaceNotVisible(true);
  }
  function update_multiple_faces_visible(){
    setMultipleFacesVisible(true);
  }
  /**
   * This function sends the current exam logs to the backend 
   * to update the database. This function is called every second.
   */
  function sendLogsToServer(){
    axios.post('/api/logs/update',{
          exam_code: exam_id,
          student_name: student_name,
          student_email: student_email,
          key_press_count: key_press,
          tab_change_count: tab_change,
          mobile_found: mobile_phone_found,
          face_not_visible: face_not_visible,
          prohibited_object_found: prohibited_object_found,
          multiple_faces_found: multiple_faces_visible,
      })
      .then(function (response){

        console.log(response);
      })
      .catch(function (error){
        console.log(error);
      })
      
  }
  /**
   * This function is called when test page is opened for the first time
   * It retrieves cheating data from the server if the student had given the exam
   * before and closed the window in between
   */
  function getPreviousLogs(){
      axios.get('/api/logs/logByEmail?exam_code='+exam_id+'&student_email='+student_email)
      .then(function (response) {
          console.log(response);
          setKeyPress(parseInt(response.data.key_press_count));
          setTabChange(parseInt(response.data.tab_change_count));
          setMobilePhoneFound(response.data.mobile_found);
          setMultipleFacesVisible(response.data.multiple_faces_found);
          setProhibitedObjectFound(response.data.prohibited_object_found);
          setFaceNotVisible(response.data.face_not_visible);
      })
      .catch(function (err) {
          console.log(err);
      });
  }

  /**
   * Function checks for tab change or minimising the window/ opening
   * another window by checking if the window is in focus or not
   */
  function handleVisibilityChange() {
    if (document.hidden) {
        // the page is hidden
        setTabChange(tab_change+1);
        swal("Changed Tab Detected", "Action has been Recorded", "error");
        
        
    } else {
      // the page is visible
    }
  }

  /**
   * This function is triggered every time a key is pressed. It the pressed 
   * key is Ctrl or Alt it shows an error and updates count
   * @param {Keypress Event} event 
   * @returns false if key is Ctrl or Alt else true
   */
  function handleKeyPress(event){
    
      if (event.altKey) {
          setKeyPress(key_press+1);
          swal('Alt Key Press Detected',"Action has been Recorded", "error");
          return false;
      }
      else if(event.ctrlKey) {
          setKeyPress(key_press+1);
          swal('Ctrl Key Press Detected',"Action has been Recorded", "error");
          return false;
      }
      else {
          return true;
      }
      
  }

  useEffect(() => {
    
    // Initialising all the event handlers when the page loads
    document.addEventListener("visibilitychange", handleVisibilityChange, false);
    document.addEventListener('contextmenu', function (e) {
        e.preventDefault();
      }, false);
    document.addEventListener('keydown',handleKeyPress, false);
    
    if(!checkedPrevLogs){
      getPreviousLogs();
      setCheckedPrevLogs(true);
  }

    // Removing all event handlers when the page exits
    return function cleanup() {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      document.removeEventListener('contextmenu', function (e) {
        e.preventDefault();
      }, false);
      document.removeEventListener('keydown',(event)=>handleKeyPress(event), false);
    }
  })

  /**
   * This useEffect function runs every second. It is used to update
   * the minutes and seconds counter and send cheating data to server
   */
  useEffect(() => {
    console.log("J") ; 
  },[])

  function stopCamera(){
    console.log("Test ") ;
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      console.log("Camera stream stopped.");
    }
  }
  function handleSubmit(){
      stopCamera(); // stop the webcam
      swal("Thank You for taking the exam. Logs have been shared with your professor");
      history.push('/dashboard');
  }
  return (
  <div className="my_container" id="my_container">
    <div className="left-panel">
      <div className="detect">
        <Detection 
           MobilePhone={update_mobile_phone_found} 
           ProhibitedObject={update_prohibited_object_found} 
           FaceNotVisible={update_face_not_visible} 
           MultipleFacesVisible={update_multiple_faces_visible}
           setCameraStream={setCameraStream}
        />
      </div>
      
      <div className="time_rem">
        <p style={{ fontSize: '16px', fontWeight: '500', margin: '0 0 5px 0' }}>Timer:</p>
        {minutes === 0 && seconds === 1 ? null : 
          <h1 style={{ fontSize: '48px', margin: 0, fontWeight: '600' }}>
            {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
          </h1>
        }
      </div>
      
      <div className="name">
        <h6 style={{ fontSize: '16px', margin: '5px 0' }}>Name: <span style={{ fontSize: '18px', fontWeight: '500' }}>{student_name}</span></h6>
        <h6 style={{ fontSize: '16px', margin: '5px 0' }}>Exam ID: <span style={{ fontSize: '18px', fontWeight: '500' }}>{exam_id}</span></h6>
      </div>

      <div className="instructions">
        <p style={{ fontSize: '16px', textAlign: 'center', margin: 0 }}>
          Complete all questions and click <strong>Submit Exam</strong> when you're done.<br/> 
          Click <strong>Exit Exam</strong> only after submitting.
        </p>
      </div>
      
      <div className="exit">
        <Button
          className="submit-btn"
          style={{ 
            fontSize: '15px',
            padding: '8px 20px'
          }}
          variant="contained"
          disabled={isSubmitting}
          onClick={handleSubmit}>
          {isSubmitting ? 'Submitting...' : 'Submit Exam'}
        </Button>
        <Button
          className="exit-btn"
          style={{ 
            fontSize: '15px',
            padding: '8px 20px'
          }}
          variant="outlined"
          onClick={handleSubmit}>
          Exit Exam
        </Button>
      </div>
    </div>
    
    <div className="test">
      <h2 style={{ fontSize: '24px', marginBottom: '20px' }}>{exam?.name}</h2>
      <div className="question-list" style={{ padding: '10px 5px' }}>
        {exam?.questions?.map((question, idx) => (
          <QuestionPage 
            key={idx} 
            question={{ ...question, questionNumber: idx }}
            onAnswerChange={(answer) => handleAnswerChange(idx, answer)}
            userAnswer={answers[idx] || ''}
          />
        ))}
      </div>
    </div>
  </div>
  )


}




