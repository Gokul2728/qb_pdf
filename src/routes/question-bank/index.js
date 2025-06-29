// import { useNavigate, useParams } from "react-router-dom";
import { apiGetRequest } from "../../functions/api";
import { useEffect, useRef, useState } from "react";
// import AppSpinner from "../../components/spinner";
import CustomButton from "../../components/button";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import Logo from "../../assets/img/logo.png";
import DOMPurify from "dompurify";
// import "./style.css";

function QuestionView() {
  // const navigate = useNavigate();

  const initialData = [];
  const [questionDetails, setQuestionDetails] = useState(0);
  const [questionDetailsRejected, setRejectedQuestions] = useState(0);
  const contentRef = useRef();

  //
  const fetchAPI = async () => {
    var res = await apiGetRequest(
      `/getcourses/2024 - 2025/ODD/22AI302 / 22AM302 / 22CS302 / 22IT302`
    );
    if (res.success) {
      console.log(res);
      // setQuestionDetails(res.data.question_details);
    }
  };

  // const handleDownloadPdf = async () => {
  //   const content = contentRef.current;
  //   if (!content) return;

  //   await new Promise((resolve) => {
  //     const images = content.querySelectorAll("img");
  //     let loadedImages = 0;

  //     if (images.length === 0) {
  //       resolve();
  //       return;
  //     }

  //     images.forEach((img) => {
  //       if (img.complete) {
  //         loadedImages++;
  //         if (loadedImages === images.length) resolve();
  //       } else {
  //         img.onload = () => {
  //           loadedImages++;
  //           if (loadedImages === images.length) resolve();
  //         };
  //         img.onerror = () => {
  //           loadedImages++;
  //           if (loadedImages === images.length) resolve();
  //         };
  //       }
  //     });
  //   });

  //   const canvas = await html2canvas(content, { scale: 2, useCORS: true });
  //   const imgData = canvas.toDataURL("image/png");
  //   const pdf = new jsPDF("p", "mm", "a4");

  //   const imgWidth = 210;
  //   const pageHeight = 297;
  //   const imgHeight = (canvas.height * imgWidth) / canvas.width;
  //   let heightLeft = imgHeight;
  //   let position = 0;

  //   if (heightLeft <= pageHeight) {
  //     pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
  //   } else {
  //     while (heightLeft > 0) {
  //       pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
  //       heightLeft -= pageHeight;
  //       position -= pageHeight;
  //       if (heightLeft > 0) {
  //         pdf.addPage();
  //       }
  //     }
  //   }

  //   pdf.save("download.pdf");
  // };
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
      <div className="bg-white w-full p-3 rounded">
        <div className="flex justify-spaceEvenly">
          <div
            ref={contentRef}
            className="question-paper"
            style={{
              overflow: "auto",
              position: "relative",
              padding: "10px",
              width: "210mm",
            }}
          >
            <div className="flex">
              <div className="border-l border-t border-b border-gray-400 p-5 flex flex-col justify-center items-center">
                <img src={Logo} width={100} alt="Logo" />
              </div>
              <div className="flex flex-col justify-center items-center flex-1 border-b border-gray-400">
                <div className="p-3 w-full border-t border-l border-r border-gray-400 flex flex-col justify-center items-center flex-1">
                  <h3 className="text-xl font-normal">
                    BANNARI AMMAN INSTITUTE OF TECHNOLOGY
                  </h3>
                  <h3 className="text-sm font-normal">
                    (An Autonomous Institution Affiliated to Anna University,
                    Chennai)
                  </h3>
                  <h3 className="text-md font-normal">
                    SATHYAMANGALAM - 638 401
                  </h3>
                </div>
              </div>
            </div>
            <table
              style={{ fontFamily: "Arial", fontSize: "15px" }}
              className="w-full border-l border-r border-b border-gray-400"
            >
              <tr>
                <td
                  rowSpan={2}
                  className="p-2 w-20 border-r border-b border-gray-400"
                  style={{ verticalAlign: "top", textAlign: "center" }}
                >
                  A1
                </td>
                <td
                  rowSpan={2}
                  className="p-2 w-10 border-r border-b border-gray-400"
                  style={{ verticalAlign: "top", textAlign: "center" }}
                >
                  (i)
                </td>
                <td
                  className="p-2 pr-5 border-r border-b border-gray-400"
                  align="justify"
                >
                  <div
                    className="sanitized-content1"
                    // style={{ width: "auto" }}
                    dangerouslySetInnerHTML={{
                      __html: sanitizedHTML(questionDetails.question),
                    }}
                  ></div>
                  <h1 className="mt-5 font-medium">Topic</h1>
                  <h2>{questionDetails.topic}</h2>
                  <div className="flex justify-end w-full">
                    <h2 className="flex justify-end w-full font-normal">
                      ( {questionDetails.mark} Mark
                      {questionDetails.mark > 1 ? "s" : ""}{" "}
                      {questionDetails.rdt} )
                    </h2>
                  </div>
                </td>
              </tr>
              <tr>
                <td
                  className="p-2 pr-5 border-r border-b border-gray-400"
                  align="justify"
                >
                  <h3 className="font-medium">Answer</h3>
                  <div className="flex justify-start mt-2">
                    <div
                      className="sanitized-content1"
                      style={{
                        width: "auto",
                      }}
                      dangerouslySetInnerHTML={{
                        __html: sanitizedHTML(questionDetails.answer),
                      }}
                    ></div>
                  </div>
                </td>
              </tr>
            </table>
          </div>
          <div style={{ width: 400 }} className="flex flex-col gap-3">
            <div className="flex gap-3 mt-4">
              {!["1", 1, "2", 2].includes(questionDetails.status) && (
                <>
                  <CustomButton
                    label="Submit for Approval"
                    onClick={() => {
                      // updateState();
                    }}
                  />
                  <CustomButton
                    label="Edit"
                    onClick={() => {
                      // navigate("edit");
                    }}
                  />
                </>
              )}

              {questionDetails.allow_delete && (
                <>
                  <CustomButton
                    label="Delete Question"
                    onClick={() => {
                      // deleteQuestion();
                    }}
                  />
                  {/* <CustomButton label="Move Draft" onClick={moveDraft} /> */}
                </>
              )}
            </div>

            {(questionDetails.remarks_category !== "" ||
              questionDetails.remarks !== "") && (
              <div className="bg-white w-full p-3 rounded">
                <h3 className="font-bold">Rejection Comments</h3>
                <h3 className="mt-3 font-medium">
                  {questionDetails.remarks_category}
                </h3>
                <h3>{questionDetails.remarks}</h3>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
export default QuestionView;
