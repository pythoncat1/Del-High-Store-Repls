export default function Linkify(text: string) {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const parts = text.split(urlRegex);

  return (
    <>
      {parts.map((part, i) => {
        if (part.match(urlRegex)) {
          return (
            <a key={i} href={part} target="_blank" rel="noopener noreferrer">
              {part}
            </a>
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </>
  );
}
