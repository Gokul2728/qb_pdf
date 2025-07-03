import React from "react";
// import { useNavigate, useParams } from "react-router-dom";
import { apiGetRequest } from "../../functions/api";
import { useEffect, useRef, useState } from "react";
// import AppSpinner from "../../components/spinner";
import CustomButton from "../../components/button";
import CustomDropDown from "../../components/custom-dropdown"; // Make sure this path is correct
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import Logo from "../../assets/img/logo.png";
import DOMPurify from "dompurify";
import "./style.css";

function QuestionView() {
  // const navigate = useNavigate();

  const initialData = [];
  const [questionDetails, setQuestionDetails] = useState(initialData);
  const [questionDetailsRejected, setRejectedQuestions] = useState(0);
  const contentRef = useRef();

  const [selectedAcademicYear, setSelectedAcademicYear] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [courseOptions, setcourseOptions] = useState(null);

  // --- Dropdown Options ---
  // In a real application, you might fetch these from an API
  const academicYearOptions = [
    { value: "2025 - 2026 (ODD)", label: "2025 - 2026 (ODD)" },
    { value: "2025 - 2026 (EVEN)", label: "2025 - 2026 (EVEN)" },
  ];

  // const courseOptions = [
  //   {
  //     value: "(22AI302 / 22AM302 / 22CS302 / 22IT302)",
  //     label: "Common Course for AI, AM, CS, IT",
  //   },
  //   { value: "22EC301", label: "22EC301 - Electronics" },
  //   { value: "22ME305", label: "22ME305 - Mechanical" },
  // ];
  const [loading, setLoading] = useState(false);

  const GetCourse = async () => {
    try {
      setLoading(true);
      const res = await apiGetRequest(`/getcourses`);
      if (res.success) {
        setcourseOptions(
          res.data.data.map((course) => ({
            label: `${course.course_code} - ${course.course_name}`,
            value: course.course_code,
          }))
        );
      }
    } catch (error) {
      console.log("Error fetching courses:", error);
    } finally {
      setLoading(false);
    }
  };

  //
  const fetchAPI = async (academicYear, course) => {
    if (!academicYear || !course) {
      setQuestionDetails([]);
      return;
    }

    // Safely extract string
    const yearSemString =
      typeof academicYear === "object" && academicYear !== null
        ? academicYear.value
        : academicYear;

    if (typeof yearSemString !== "string") {
      console.error("Invalid academic year format:", yearSemString);
      setQuestionDetails([]);
      return;
    }

    const match = yearSemString.match(/^(.+?)\s+\((.+)\)$/);
    const year = match?.[1];
    const sem = match?.[2];

    const combinedCourse = encodeURIComponent(`(${course})`);

    try {
      const res = await apiGetRequest(
        `/getQuestion/${year}/${sem}/${combinedCourse}`
      );
      if (res.success) {
        setQuestionDetails(res.data.question_details);
      } else {
        setQuestionDetails([]);
      }
    } catch (err) {
      console.error("API error", err);
      setQuestionDetails([]);
    }
  };

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
  //

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
  }, []);
  useEffect(() => {
    if (selectedAcademicYear && selectedCourse) {
      fetchAPI(selectedAcademicYear, selectedCourse);
    }
  }, [selectedAcademicYear, selectedCourse]);

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
              className="question-paper-container" // New container class for the whole paper
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
                                <h2 className="font-medium ">{q.topic}</h2>
                              </>
                            )}
                            <div className="mark-section">
                              <h2 className="mark-text">
                                ({q.mark} Mark{q.mark > 1 ? "s" : ""} {q.rdt})
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
