useEffect(() => {
  const deletionHistory = localStorage.getItem("deletionHistory");
  if (deletionHistory) {
    setDeletionHistory(JSON.parse(deletionHistory));
  }
}, []);

useEffect(() => {
  localStorage.setItem("deletionHistory", JSON.stringify(deletionHistory));
}, [deletionHistory]);
