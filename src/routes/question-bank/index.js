import React from "react";
// import { useNavigate, useParams } from "react-router-dom";
import { apiGetRequest } from "../../functions/api";
import { useEffect, useRef, useState } from "react";
// import AppSpinner from "../../components/spinner";
import CustomButton from "../../components/button";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import Logo from "../../assets/img/logo.png";
import DOMPurify from "dompurify";
import "./style.css";

function QuestionView() {
  // const navigate = useNavigate();

  const initialData = [];
  const [questionDetails, setQuestionDetails] = useState(0);
  const [questionDetailsRejected, setRejectedQuestions] = useState(0);
  const contentRef = useRef();

  //
  const fetchAPI = async () => {
    const combinedCourse = encodeURIComponent(
      "(22AI302 / 22AM302 / 22CS302 / 22IT302)"
    );
    var res = await apiGetRequest(
      `/getcourses/2025 - 2026/ODD/${combinedCourse}`
    );
    if (res.success) {
      setQuestionDetails(res.data.question_details);
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
    fetchAPI();
  }, []);
  return (
    <>
      <div className="flex-row">
        <div className="bg-white w-full p-5 rounded">
          <div className="flex justify-center">
            {" "}
            {/* Use justify-center for centering the paper */}
            <div
              ref={contentRef}
              className="question-paper-container" // New container class for the whole paper
              style={{
                width: "210mm",
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

              {/* Questions Section */}
              <table className="qp-questions-table">
                <tbody>
                  {Array.isArray(questionDetails) &&
                    questionDetails.map((q, index) => (
                      <React.Fragment key={index}>
                        <tr className="question-row">
                          <td className="qp-cell-a-number" rowSpan={2}>
                            A{index}
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
                        {/* This row is for the answer, it spans the content column */}
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
                    ))}
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
        />
      </div>
    </>
  );
}
export default QuestionView;
