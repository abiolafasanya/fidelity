class UI {
  #initialPage = "overview";
  constructor() {}
  get initialPage() {
    return this.#initialPage;
  }

  tag(name) {
    return document.querySelector(name);
  }
  variables() {
    return {
      pages: this.tag("#pages"),
      sidebar: this.tag("#aside"),
    };
  }
  displayCurrentPage(name) {
    this.displayPage(name);
  }

  listenForPageChange() {
    const that = this;
    const { sidebar } = that.variables();

    function then(callback) {
      sidebar.addEventListener("click", function (event) {
        let { target } = event;
        if (!target.getAttribute("data-id")) target = target.parentElement;

        if (target.getAttribute("data-id")) {
          // gives the callback the id of the page to be displayed
          const pageId = target.getAttribute("data-id");
          return callback(pageId);
        }
      });
    }

    return { then };
  }

  changePage(page) {
    this.displayPage(page);
  }
  displayPage(page) {
    const { pages } = this.variables();
    // hide all pages first
    Array.from(pages.children).forEach((element) => {
      element.style.display = "none";
    });

    // then display the provided page
    this.tag(`#${page}`).style.display = "block";
  }

  static start() {
    const ui = new this();
    ui.displayCurrentPage(ui.initialPage);

    ui.listenForPageChange().then((pageId) => ui.displayPage(pageId));
  }
}
UI.start();

// fetch result from submitted

let submitAssignment = document.querySelector("#submitAssignment");
submitAssignment.addEventListener("submit", (e) => {
  e.preventDefault();
  console.log("yeah asssignment submiited");
  let name, classId, subject, upload;
  name = e.target.name.value;
  classId = e.target.classId.value;
  subject = e.target.subject.value;
  upload = e.target.upload.files[0];
  console.log(name, classId, subject, upload);

  const formData = new FormData();
  formData.append("upload", upload);
  formData.append("subject", subject);
  formData.append("name", name);
  formData.append("classId", classId);

  const getElement = (e) => document.querySelector(e);
  const newElement = (e) => document.createElement(e);
  // const elementText = (e) => document.createTextNode(e);

  fetch("/assignment/submit", {
    method: "post",
    credentials: "same-origin",
    body: formData,
  }).then((data) => {
    if (data.ok) {
      console.log(data.ok, data.message);
      // alert("Assignment Submitted")

      let container = getElement("#container");
      let form = getElement("#submitAssignment");
      let alert = newElement("div");
      alert.setAttribute("class", "alert alert-success text-center");
      alert.innerHTML = "Assignment Submitted";
      container.insertBefore(alert, form);
      e.target.name.value = "";
      e.target.subject.value = "";
      e.target.classId.value = "";
      e.target.upload.value = "";

      setTimeout(() => {
        alert.setAttribute("class", "d-none")
      }, 5000);

    } else {
      console.log("failed");
      alert("Assignment not Submitted");
      e.target.name.value = "";
      e.target.subject.value = "";
      e.target.classId.value = "";
      e.target.upload.value = "";
    }
  });
});

// fetch for grade assignment for teacher

// let gradeAssignment = document.querySelector("#gradeAssignment")

// gradeAssignment.addEventListener("submit", e => {

//   fetch(`/assignment/grade/`, {
//     method: "post",
//     credentials: "same-origin",
//     body: formData,
//   })
// })
