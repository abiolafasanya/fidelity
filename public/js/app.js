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
let form = document.querySelector("form");
let formArea = document.querySelector("#formArea");
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
  

  fetch("/assignment/submit", {
    method: "post",
    credentials: "same-origin",
    body: formData,
  }).then((data) => {
    if (data.ok) {
      console.log(data.ok, data.message);
      alert("Assignment Submitted")
      e.target.name.value = "";
      e.target.subject.value = "";
      e.target.classId.value = "";
      e.target.upload.value = "";
    } else {
      console.log("failed");
      alert("Assignment not Submitted")
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