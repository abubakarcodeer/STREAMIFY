export const capitialize = (str) => str.charAt(0).toUpperCase() + str.slice(1);
export  const handleImageError = (e) => {
    e.target.src = `https://ui-avatars.com/api/?name=${e.target.alt}&background=random`;
  };