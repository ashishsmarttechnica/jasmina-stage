import { useTranslations } from "next-intl";

const CommentInput = ({ value, onChange, onSubmit }) => {
  const t = useTranslations("FeedComment");
  return (
    <div className="flex items-center justify-between px-4 py-2 border-t border-black/10 sticky bottom-0 bg-white">
      <input
        type="text"
        placeholder={t("commentPlaceholder")}
        className="py-2 px-4 w-full text-custBlack bg-lightWhite text-sm rounded-sm border border-gray-300 focus:outline-none focus:ring-1 focus:ring-primary transition-all"
        value={value}
        onChange={onChange}
      />
      <button
        onClick={onSubmit}
        disabled={!value.trim()}
        className="ml-2 px-4 py-2 text-sm font-medium rounded-sm transition-all duration-200
          disabled:opacity-50 disabled:cursor-not-allowed
          text-white bg-primary hover:bg-primary/90"
      >
        {t("send")}
      </button>
    </div>
  );
};

export default CommentInput;
