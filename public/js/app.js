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
  let payload = {
    name,
    classId,
    subject,
    upload,
  };
  const msgAlert = document.createElement("div");
  fetch("/assignment/submit", {
    method: "post",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  }).then((data) => {
    if (data.ok) {
      console.log(data.ok, data.message);
      let msg = document.createTextNode(data.message);
      msgAlert.appendChild(msg);
      msgAlert.classList.add("alert", "alert-success");
      formArea.insertBefore(msgAlert, form);
      setTimeout(() => {
        msgAlert.className = "hidden";
      }, 6000);
      name.value = "";
      subject.value = "";
      classId.value = "";
      upload.value = "";
    } else {
      console.log("failed");
      let msg = document.createTextNode(data.message || "Submittion Failed");
      msgAlert.appendChild(msg);
      msgAlert.classList.add("alert", "alert-danger");
      formArea.insertBefore(msgAlert, form);
      setTimeout(() => {
        msgAlert.classList.add("hidden");
      }, 8000);
      name.value = "";
      subject.value = "";
      classId.value = "";
      upload.value = "";
    }
  });
});
