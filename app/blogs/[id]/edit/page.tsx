import EditBlogForm from "./EditBlogForm";

const EditBlogPage = ({ params }: { params: { id: string } }) => {
  return <EditBlogForm id={params.id} />;
};

export default EditBlogPage; 