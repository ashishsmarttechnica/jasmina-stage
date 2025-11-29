const LGBTQCheckbox = ({ show, isChecked, setIsChecked, lgbtqError }) => {
  if (!show) return null;
  return (
    <div className="mt-4">
      <div className="flex items-start gap-2">
        <input
          type="checkbox"
          id="lgbtq-checkbox"
          className="border-grayBlueText/[50%] mt-1 h-8 w-8 border bg-gray-100 text-blue-600"
          checked={isChecked}
          onChange={(e) => setIsChecked(e.target.checked)}
        />
        <label htmlFor="lgbtq-checkbox" className="text-sm text-gray-600">
          <p className="text-grayBlueText text-sm text-[13px] leading-[21px]">
            By activating this, Our company commits to being LGBTQ+ inclusive and operating in a
            country that respects LGBTQ+ rights. We agree to provide documentation upon request and
            await admin approval
          </p>
        </label>
      </div>
      {lgbtqError && <div className="mt-1 text-[13px] text-red-600">{lgbtqError}</div>}
    </div>
  );
};

export default LGBTQCheckbox;
