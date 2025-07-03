import React, { useEffect, useRef, useState, useCallback } from "react";
// import { useNavigate, useParams } from "react-router-dom"; // Commented out as not used
// import { apiGetRequest } from "../../functions/api"; // Commented out as not used for static data
// import AppSpinner from "../../components/spinner"; // Commented out as not used
import CustomButton from "../../components/button";
import CustomDropDown from "../../components/custom-dropdown"; // Make sure this path is correct
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import Logo from "../../assets/img/logo.png";
import DOMPurify from "dompurify";
import "./style.css";

// Static Data for Questions - Moved outside the component to avoid recreation on every render
const staticQuestions = [
  {
    course_name: "DATA STRUCTURES I",
    question:
      "<p>A software developer is implementing a binary search algorithm to quickly find user names in an ordered array of a large customer database. To evaluate the performance of the search, they count the number of comparisons made during execution. This helps determine how efficiently the algorithm runs as the dataset grows. Pick out the type of complexity measured by counting the number of key operations like comparisons. It is critical in evaluating sorting and searching algorithms.</p><p>a) Time complexity</p><p>b) Space complexity</p><p>c) Memory complexity</p><p>d) data complexity<br></p>",
    answer: "<p>a) Time complexity</p>",
    course_co: "CO1",
    co_part: "A",
    difficulty_level: "Easy - 1",
    mark: "1",
    cognitive: "Understand - U",
    knowledge: "Conceptual - C",
    remark_category: "",
    remarks: "",
    status: "1",
    topic: "4 - Searching in Arrays and Ordered Arrays",
    rdt: "R",
  },
  {
    course_name: "DATA STRUCTURES I",
    question:
      "<p>In a student information system, multiple student records—each containing fields like name, ID, and marks—are stored together in a single collection for easy retrieval and management. This collection groups records of the same entity type, enabling efficient access to structured data, similar to what is found in database systems. Identify the structure where a collection of records of the same entity type is grouped together. It is fundamental for database-style storage.</p><p>a) Group item</p><p>b) File</p><p>c) Record</p><p>d) Field<br></p>",
    answer: "<p>b) File</p>",
    course_co: "CO1",
    co_part: "A",
    difficulty_level: "Easy - 1",
    mark: "1",
    cognitive: "Understand - U",
    knowledge: "Conceptual - C",
    remark_category: "Others",
    remarks: "Need to remove unwanted symbols __ in the scenario",
    status: "3",
    topic: "1 - Data Structures Hierarchy",
    rdt: "R",
  },
  {
    course_name: "DATA STRUCTURES I",
    question:
      "<p>A developer is optimizing an application designed for mobile devices with limited memory. While reviewing different algorithms, the developer focuses on how much memory is required while the algorithm runs, to ensure it fits within hardware constraints. Pick out the factor that decides how much memory an algorithm needs during its execution.</p><p>a) Input size only</p><p>b) CPU speed</p><p>c) Space complexity</p><p>d) Compilation time<br></p>",
    answer: "<p>c) Space complexity</p>",
    course_co: "CO1",
    co_part: "A",
    difficulty_level: "Easy - 1",
    mark: "1",
    cognitive: "Analyze - An",
    knowledge: "Conceptual - C",
    remark_category: "",
    remarks: "",
    status: "1",
    topic: "1 - Data Structures Hierarchy",
    rdt: "R",
  },
  {
    course_name: "DATA STRUCTURES I",
    question:
      "<p>A team of developers is documenting a sorting algorithm to share with programmers using different programming languages like Python, Java, and C++. To ensure the algorithm can be adopted without rewriting the core logic for each language, they use a format that outlines logical steps without relying on any programming syntax. Find the property that makes an algorithm language independent.&nbsp;</p><p>a) Plain logical steps</p><p>b) Syntax-specific structure</p><p>c) Pseudocode dependent</p><p>d) Fixed programming language</p>",
    answer: "<p>a) Plain logical steps</p>",
    course_co: "CO1",
    co_part: "A",
    difficulty_level: "Easy - 1",
    mark: "1",
    cognitive: "Understand - U",
    knowledge: "Conceptual - C",
    remark_category: "",
    remarks: "",
    status: "1",
    topic: "1 - Data Structures Hierarchy",
    rdt: "R",
  },
];

function QuestionView() {
  // const navigate = useNavigate(); // Not used

  const initialData = [];
  const [questionDetails, setQuestionDetails] = useState(initialData);
  // const [questionDetailsRejected, setRejectedQuestions] = useState(0); // Removed as not used
  const contentRef = useRef();

  const [selectedAcademicYear, setSelectedAcademicYear] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [courseOptions, setcourseOptions] = useState(null);

  // --- Dropdown Options ---
  const academicYearOptions = [
    { value: "2025 - 2026 (ODD)", label: "2025 - 2026 (ODD)" },
    { value: "2025 - 2026 (EVEN)", label: "2025 - 2026 (EVEN)" },
  ];

  const [loading, setLoading] = useState(false);

  const GetCourse = async () => {
    setLoading(true);
    setTimeout(() => {
      setcourseOptions([
        {
          value: "Common Course for AI, AM, CS, IT",
          label: "Common Course for AI, AM, CS, IT",
        },
        { value: "22EC301", label: "22EC301 - Electronics" },
        { value: "22ME305", label: "22ME305 - Mechanical" },
        { value: "DATA STRUCTURES I", label: "DS101 - DATA STRUCTURES I" },
      ]);
      setLoading(false);
    }, 500);
  };

  // Wrapped fetchAPI in useCallback to stabilize it for useEffect dependency
  const fetchAPI = useCallback(
    async (academicYear, course) => {
      if (!academicYear || !course) {
        setQuestionDetails([]);
        return;
      }

      const yearSemString =
        typeof academicYear === "object" && academicYear !== null
          ? academicYear.value
          : academicYear;

      if (typeof yearSemString !== "string") {
        console.error("Invalid academic year format:", yearSemString);
        setQuestionDetails([]);
        return;
      }

      const selectedCourseValue =
        typeof course === "object" && course !== null ? course.value : course;

      // Filter staticQuestions directly by course_name matching selectedCourseValue
      const filteredQuestions = staticQuestions.filter(
        (q) => q.course_name === selectedCourseValue
      );

      setQuestionDetails(filteredQuestions);
    },
    [setQuestionDetails] // setQuestionDetails is a stable function provided by React
  );

  const handleDownloadPdf = async () => {
    const content = contentRef.current;
    if (!content) return;

    await new Promise((resolve) => {
      const images = content.querySelectorAll("img");
      let loadedImages = 0;

      if (images.length === 0) {
        resolve();
        return;
      }

      images.forEach((img) => {
        if (img.complete) {
          loadedImages++;
          if (loadedImages === images.length) resolve();
        } else {
          img.onload = () => {
            loadedImages++;
            if (loadedImages === images.length) resolve();
          };
          img.onerror = () => {
            loadedImages++;
            if (loadedImages === images.length) resolve();
          };
        }
      });
    });

    const canvas = await html2canvas(content, { scale: 2, useCORS: true });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");

    const imgWidth = 210;
    const pageHeight = 297;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    if (heightLeft <= pageHeight) {
      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
    } else {
      while (heightLeft > 0) {
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
        position -= pageHeight;
        if (heightLeft > 0) {
          pdf.addPage();
        }
      }
    }

    pdf.save("download.pdf");
  };

  const sanitizedHTML = (question) => {
    return DOMPurify.sanitize(question, {
      ALLOWED_TAGS: [
        "i",
        "em",
        "a",
        "img",
        "p",
        "div",
        "span",
        "table",
        "thead",
        "tbody",
        "tr",
        "td",
        "th",
        "br",
        "sup",
        "sub",
        "superscript",
        "math",
        "mrow",
        "msup",
        "msub",
        "mi",
        "mo",
        "mn",
        "mfrac",
        "msqrt",
        "msubsup",
        "mtable",
        "mtr",
        "mtd",
        "mstyle",
        "merror",
        "mpadded",
        "mphantom",
        "mfenced",
        "mspace",
        "mprescripts",
        "none",
        "munder",
        "mover",
        "munderover",
        "mmultiscripts",
        "mtext",
        "ms",
        "maction",
      ],
      ALLOWED_ATTR: ["href", "src", "alt", "title", "class", "id", "style"],
      ALLOW_DATA_ATTR: false,
      ALLOWED_URI_REGEXP:
        /^data:image\/(png|jpeg|jpg|gif);base64,|^https?:\/\//i,
    });
  };

  useEffect(() => {
    GetCourse();
  }, []); // Empty dependency array means this runs once on mount

  useEffect(() => {
    if (selectedAcademicYear && selectedCourse) {
      fetchAPI(selectedAcademicYear, selectedCourse);
    }
  }, [selectedAcademicYear, selectedCourse, fetchAPI]); // Added fetchAPI to dependency array

  return (
    <>
      <div className="flex-row">
        <div className="bg-white w-full p-5 rounded">
          {/* --- Dropdown Controls --- */}
          <div className="controls-container" style={{ marginBottom: "20px" }}>
            <div style={{ display: "flex", gap: "20px" }}>
              <CustomDropDown
                label="Academic Year"
                name="academicYear"
                options={academicYearOptions}
                onChange={(value) => setSelectedAcademicYear(value)}
                placeholder="Select Academic Year"
                className="dropdown-container"
              />
              {loading ? (
                <p>Loading Courses...</p>
              ) : (
                <CustomDropDown
                  label="Course"
                  name="course"
                  options={courseOptions}
                  onChange={(value) => setSelectedCourse(value)}
                  placeholder="Select Course"
                  className="dropdown-container"
                />
              )}
            </div>
          </div>
          <div className="flex justify-center">
            <div
              ref={contentRef}
              className="question-paper-container"
              style={{
                width: "210mm",
                margin: "15mm",
                boxSizing: "border-box",
                border: "1px solid #666",
                display: "flex",
                flexDirection: "column",
              }}
            >
              {/* Header Section */}
              <table className="qp-header-table">
                <tbody>
                  <tr>
                    <td className="header-logo-cell">
                      <img src={Logo} width={100} alt="Logo" />
                    </td>
                    <td className="header-text-cell">
                      <div className="header-text-content">
                        <h3 className="institute-name">
                          BANNARI AMMAN INSTITUTE OF TECHNOLOGY
                        </h3>
                        <h3 className="affiliation">
                          (An Autonomous Institution Affiliated to Anna
                          University, Chennai)
                        </h3>
                        <h3 className="address">SATHYAMANGALAM - 638 401</h3>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>

              <table className="qp-questions-table">
                <tbody>
                  {Array.isArray(questionDetails) &&
                  questionDetails.length > 0 ? (
                    questionDetails.map((q, index) => (
                      <React.Fragment key={index}>
                        <tr className="question-row">
                          <td className="qp-cell-a-number" rowSpan={2}>
                            A{index + 1}
                          </td>
                          <td className="qp-cell-sub-q" rowSpan={2}>
                            (i)
                          </td>
                          <td className="qp-cell-question-content">
                            <div
                              className="sanitized-content"
                              dangerouslySetInnerHTML={{
                                __html: sanitizedHTML(q.question),
                              }}
                            ></div>
                            {q.topic && (
                              <>
                                <h1 className="topic-heading">Topic</h1>
                                <h3 className="font-medium ">{q.topic}</h3>
                              </>
                            )}
                            <div className="mark-section">
                              {/* UPDATED LINE HERE TO MATCH YOUR DESIRED FORMAT */}
                              <h2 className="mark-text">
                                {q.course_co} - {q.co_part} ({q.mark})<br />
                                {q.cognitive}
                              </h2>
                            </div>
                          </td>
                        </tr>

                        <tr className="answer-row">
                          <td className="qp-cell-answer-content">
                            <h3 className="answer-heading">Answer</h3>
                            <div
                              className="sanitized-content answer-text"
                              dangerouslySetInnerHTML={{
                                __html: sanitizedHTML(
                                  q.answer || "Answer not available."
                                ),
                              }}
                            ></div>
                          </td>
                        </tr>
                      </React.Fragment>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="3"
                        style={{
                          textAlign: "center",
                          padding: "20px",
                          margin: "15mm",
                        }}
                      >
                        Please select an academic year and a course to view the
                        question paper.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <CustomButton
          label="Download PDF"
          onClick={() => {
            handleDownloadPdf();
          }}
          // Disable button if there are no questions to prevent downloading an empty PDF
          // disabled={!questionDetails || questionDetails.length === 0}
        />
      </div>
    </>
  );
}
export default QuestionView;