const express = require("express");
const router = express.Router();

const Exam = require("../../models/Exams");
const validateExamInput = require("../../validation/CreateExam");

/**
 * Post request on /createExam creates an exam
 * First a custom validator validates the requests
 * Then we try to check if same exam code is present. If not then
 * we create the exam else we display error
 */


router.get("/:id", async (req, res) => {
    const examId = req.params.id;
    
    try {
        const exam = await Exam.find({exam_code:examId});
        if (!exam) {
            return res.status(404).json({ error: "Exam not found" });
        }
        return res.status(200).json(exam);
    } catch (error) {
        console.error("Error fetching exam by ID:", error);
        return res.status(500).json({ error: "Server error" });
    }
});
router.post("/createExam", (req, res) =>{
     
    // console.log("RE " , req.body);
    // return res.status(400).json({message: "Hiii"}) ; 
    
    // validate exam data for errors
    const {errors, isValid} = validateExamInput(req.body);
    try {
        Exam.findOne({exam_code : req.body.exam_code}).then(exam=>{
            // if exam code is already present return error
            if(exam){
                return res.status(400).json({name: "Exam with this code exists in database"});
            }
            else{
    
                const newExam = new Exam({
                    name: req.body.name,
                    date_time_start: req.body.date_time_start,
                    duration: req.body.duration,
                    exam_code:req.body.exam_code,
                    questions: req.body.questions , 
                });
                
                newExam.save().then(exam=>res.join(exam)).catch(err=> console.log(err));
                return res.status(200).json(newExam);
    
            }
        });
    } catch (error) {
        console.log('Error in exam api ' , error);
    }


});

/**
 * Get requests on /examByCode with exam_code as the query parameter
 * return exam object if exam code is correct else an error is raised
 */
router.get("/examByCode", (req, res) => {
    const req_exam_code=req.query.exam_code;
    Exam.findOne({ exam_code : req_exam_code}).then(exam=>{
        
        if(!exam){
            return res.status(400).json("Exam Code is invalid");
        }
        console.log('Ex ' , exam);
        
        return res.status(200).json(exam);
    });
}); 

/**
 * Get requests on /examByProf with exam_code and prof_email as query parameter
 * return exam object if the exam code is correct and it was created by the professor
 * with prof_email id
 * else returns an error
 */
router.get("/examsByProf", (req, res) => {
    const req_exam_code=req.query.exam_code;
    const req_prof_email=req.query.prof_email;
    Exam.findOne({ prof_email: req_prof_email, exam_code: req_exam_code}).then(doc=> {
        if(!doc){
            return res.status(400).json("Exam doesn't exist or professor doesnt have permission");
        }
        return res.status(200).json(doc);
    });
});

// export the router
module.exports = router;