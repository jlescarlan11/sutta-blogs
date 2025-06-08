import EditBlogForm from "./EditBlogForm";

const EditBlogPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  return <EditBlogForm id={id} />;
};

export default EditBlogPage;
