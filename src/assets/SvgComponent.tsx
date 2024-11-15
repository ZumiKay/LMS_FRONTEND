/* eslint-disable @typescript-eslint/no-explicit-any */

export const EyeSlashFilledIcon = (props: { className: string }) => (
  <svg
    aria-hidden="true"
    fill="none"
    focusable="false"
    height="1em"
    role="presentation"
    viewBox="0 0 24 24"
    width="1em"
    {...props}
  >
    <path
      d="M21.2714 9.17834C20.9814 8.71834 20.6714 8.28834 20.3514 7.88834C19.9814 7.41834 19.2814 7.37834 18.8614 7.79834L15.8614 10.7983C16.0814 11.4583 16.1214 12.2183 15.9214 13.0083C15.5714 14.4183 14.4314 15.5583 13.0214 15.9083C12.2314 16.1083 11.4714 16.0683 10.8114 15.8483C10.8114 15.8483 9.38141 17.2783 8.35141 18.3083C7.85141 18.8083 8.01141 19.6883 8.68141 19.9483C9.75141 20.3583 10.8614 20.5683 12.0014 20.5683C13.7814 20.5683 15.5114 20.0483 17.0914 19.0783C18.7014 18.0783 20.1514 16.6083 21.3214 14.7383C22.2714 13.2283 22.2214 10.6883 21.2714 9.17834Z"
      fill="currentColor"
    />
    <path
      d="M14.0206 9.98062L9.98062 14.0206C9.47062 13.5006 9.14062 12.7806 9.14062 12.0006C9.14062 10.4306 10.4206 9.14062 12.0006 9.14062C12.7806 9.14062 13.5006 9.47062 14.0206 9.98062Z"
      fill="currentColor"
    />
    <path
      d="M18.25 5.74969L14.86 9.13969C14.13 8.39969 13.12 7.95969 12 7.95969C9.76 7.95969 7.96 9.76969 7.96 11.9997C7.96 13.1197 8.41 14.1297 9.14 14.8597L5.76 18.2497H5.75C4.64 17.3497 3.62 16.1997 2.75 14.8397C1.75 13.2697 1.75 10.7197 2.75 9.14969C3.91 7.32969 5.33 5.89969 6.91 4.91969C8.49 3.95969 10.22 3.42969 12 3.42969C14.23 3.42969 16.39 4.24969 18.25 5.74969Z"
      fill="currentColor"
    />
    <path
      d="M14.8581 11.9981C14.8581 13.5681 13.5781 14.8581 11.9981 14.8581C11.9381 14.8581 11.8881 14.8581 11.8281 14.8381L14.8381 11.8281C14.8581 11.8881 14.8581 11.9381 14.8581 11.9981Z"
      fill="currentColor"
    />
    <path
      d="M21.7689 2.22891C21.4689 1.92891 20.9789 1.92891 20.6789 2.22891L2.22891 20.6889C1.92891 20.9889 1.92891 21.4789 2.22891 21.7789C2.37891 21.9189 2.56891 21.9989 2.76891 21.9989C2.96891 21.9989 3.15891 21.9189 3.30891 21.7689L21.7689 3.30891C22.0789 3.00891 22.0789 2.52891 21.7689 2.22891Z"
      fill="currentColor"
    />
  </svg>
);

export const EyeFilledIcon = (props: { className: string }) => (
  <svg
    aria-hidden="true"
    fill="none"
    focusable="false"
    height="1em"
    role="presentation"
    viewBox="0 0 24 24"
    width="1em"
    {...props}
  >
    <path
      d="M21.25 9.14969C18.94 5.51969 15.56 3.42969 12 3.42969C10.22 3.42969 8.49 3.94969 6.91 4.91969C5.33 5.89969 3.91 7.32969 2.75 9.14969C1.75 10.7197 1.75 13.2697 2.75 14.8397C5.06 18.4797 8.44 20.5597 12 20.5597C13.78 20.5597 15.51 20.0397 17.09 19.0697C18.67 18.0897 20.09 16.6597 21.25 14.8397C22.25 13.2797 22.25 10.7197 21.25 9.14969ZM12 16.0397C9.76 16.0397 7.96 14.2297 7.96 11.9997C7.96 9.76969 9.76 7.95969 12 7.95969C14.24 7.95969 16.04 9.76969 16.04 11.9997C16.04 14.2297 14.24 16.0397 12 16.0397Z"
      fill="currentColor"
    />
    <path
      d="M11.9984 9.14062C10.4284 9.14062 9.14844 10.4206 9.14844 12.0006C9.14844 13.5706 10.4284 14.8506 11.9984 14.8506C13.5684 14.8506 14.8584 13.5706 14.8584 12.0006C14.8584 10.4306 13.5684 9.14062 11.9984 9.14062Z"
      fill="currentColor"
    />
  </svg>
);

interface IconProps {
  [key: string]: any;
}

export const PlusIcon = ({ size = 24, width, height, ...props }: IconProps) => (
  <svg
    aria-hidden="true"
    fill="none"
    focusable="false"
    height={size || height}
    role="presentation"
    viewBox="0 0 24 24"
    width={size || width}
    {...props}
  >
    <g
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
    >
      <path d="M6 12h12" />
      <path d="M12 18V6" />
    </g>
  </svg>
);

export const VerticalDotsIcon = ({
  size = 24,
  width,
  height,
  ...props
}: IconProps) => (
  <svg
    aria-hidden="true"
    fill="none"
    focusable="false"
    height={size || height}
    role="presentation"
    viewBox="0 0 24 24"
    width={size || width}
    {...props}
  >
    <path
      d="M12 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 12c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"
      fill="currentColor"
    />
  </svg>
);

export const SearchIcon = (props: any) => (
  <svg
    aria-hidden="true"
    fill="none"
    focusable="false"
    role="presentation"
    viewBox="0 0 24 24"
    className="w-[1em] h-[1em]"
    {...props}
  >
    <path
      d="M11.5 21C16.7467 21 21 16.7467 21 11.5C21 6.25329 16.7467 2 11.5 2C6.25329 2 2 6.25329 2 11.5C2 16.7467 6.25329 21 11.5 21Z"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
    />
    <path
      d="M22 22L20 20"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
    />
  </svg>
);

export const ChevronDownIcon = ({ strokeWidth = 1.5, ...otherProps }) => (
  <svg
    aria-hidden="true"
    fill="none"
    focusable="false"
    height="1em"
    role="presentation"
    viewBox="0 0 24 24"
    width="1em"
    {...otherProps}
  >
    <path
      d="m19.92 8.95-6.52 6.52c-.77.77-2.03.77-2.8 0L4.08 8.95"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit={10}
      strokeWidth={strokeWidth}
    />
  </svg>
);

export const CartIcon = ({
  width,
  height,
}: {
  width: string;
  height: string;
}) => {
  return (
    <svg
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
    >
      <path
        d="M0 0 C1.65092192 -0.00269878 3.30184228 -0.0065844 4.95275879 -0.01159668 C8.40241725 -0.01747365 11.85165967 -0.00898742 15.30126953 0.00976562 C19.70612968 0.03255447 24.11001473 0.01942163 28.51483917 -0.00452423 C31.92082972 -0.0190313 35.32659201 -0.01435388 38.73258972 -0.00401306 C40.35597349 -0.0013593 41.9793785 -0.00456762 43.60273743 -0.01393127 C60.95446508 -0.09207145 60.95446508 -0.09207145 67.77775574 6.04618835 C71.7980823 10.26950582 73.68503507 14.77830772 75.42578125 20.26953125 C75.70383606 21.10020615 75.98189087 21.93088104 76.26837158 22.78672791 C76.85824 24.55572587 77.44067181 26.32721864 78.0161438 28.10095215 C78.91470174 30.86979341 79.83333617 33.63123293 80.75756836 36.39160156 C82.55350478 41.76587028 84.32653849 47.14747786 86.09375 52.53125 C87.76456828 57.62033656 89.45235832 62.70310879 91.15625 67.78125 C91.48923096 68.81934814 91.82221191 69.85744629 92.1652832 70.92700195 C93.98563605 76.34839738 95.52084734 79.98999418 100.09375 83.53125 C103.29001414 84.59667138 105.56267568 84.6582674 108.92224407 84.66153526 C110.75781117 84.66697178 110.75781117 84.66697178 112.63046044 84.67251813 C113.99563966 84.67152145 115.36081883 84.67043932 116.72599792 84.66928101 C118.17069127 84.67169825 119.61538392 84.67456027 121.06007558 84.67783034 C125.03980854 84.68559755 129.01952427 84.68720351 132.99926388 84.68788147 C137.28775314 84.68971871 141.57623225 84.69732423 145.86471558 84.70436096 C153.29987143 84.71589568 160.73502501 84.72413531 168.170187 84.73048019 C179.9217669 84.74079847 191.67331845 84.76136028 203.42488098 84.78359985 C207.44409075 84.79107991 211.46330064 84.7984936 215.48251057 84.80588722 C216.48701761 84.80773779 217.49152466 84.80958835 218.52647131 84.811495 C229.96564283 84.83242972 
        241.40481748 84.85125403 252.84399414 84.86914062 C253.88990494 84.87077881 254.93581573 
        84.87241699 256.0134208 84.87410481 C272.95982001 84.90038541 289.90622141 84.9190308 
        306.85263237 84.93573253 C324.24594249 84.95315172 341.63920984 84.98199581 
        359.03248578 85.0206219 C369.76333136 85.04402547 380.49410718 
        85.05801679 391.22497848 85.05994953 C398.57997759 85.06205853 405.93490733 85.07498464 413.28987529 85.09642886 
        C417.53386117 85.1084593 421.77770932 85.11560826 426.02171135 85.10971642 C429.90862443 85.10441692 433.79525666 
        85.11291109 437.68212286 85.13227279 C439.0866004 85.13684351 440.49110543 85.13638443 441.89557733 85.13032441 
        C451.98708955 85.09067558 459.97297134 85.72726769 467.6171875 92.8828125 C472.21924979 98.02056458 472.55315535 
        103.26020025 472.47192383 109.89190674 C471.6878994 117.43693978 468.9263509 124.47949933 466.46875 131.6171875 
        C465.84459484 133.47418499 465.22234944 135.33182523 464.60180664 137.19003296 C463.21488109 141.33701853 461.81865721 
        145.48073388 460.41748047 149.6229248 C457.90718857 157.0629689 455.45271769 164.5210165 453.00390625 171.98144531 
        C452.10385789 174.72249144 451.20363119 177.46347891 450.30322266 180.20440674 C449.96289316 181.24041256 449.96289316 
        181.24041256 449.61568832 182.29734778 C446.57319103 191.55415194 443.50470432 200.80235218 440.43664551 210.05070877 
        C437.99965946 217.39780966 435.5680045 224.74659064 433.14892578 232.09960938 C430.99527365 238.64582489 428.83209428 245.18879882 426.65731335 251.72802675 C425.51923418 255.15104495 424.38565374 258.57538994 423.26364136 262.0037117 C422.02397007 265.7908869 420.76291945 269.57061148 419.5 273.35009766 C419.14148453 274.45643051 418.78296906 275.56276337 418.41358948 276.70262146 C415.37685928 285.69286922 411.75017448 293.91449028 403.09375 298.53125 C400.39241334 299.43169555 398.84487244 299.65817722 396.07407761 299.66432858 C395.25382339 
        299.66856962 394.43356918 299.67281067 393.58845878 299.67718023 C392.68759929 299.6767941 391.7867398 299.67640797 390.85858154 299.67601013 C389.90132242 299.67953698 388.94406331 299.68306382 387.95779634 299.68669754 C384.73585679 299.69741003 381.51394679 299.70106996 378.29199219 299.70483398 C375.98766453 299.71113733 373.6833381 299.71790289 371.37901306 299.72509766 C366.40916955 299.73978327 361.4393308 299.75150169 356.46947479 299.76104546 C348.61213463 299.77647626 340.75483501 299.80042549 332.89752197 299.82594299 C321.88139493 299.86119475 310.86526399 299.89416398 299.84912109 299.92407227 C299.1498593 299.92597276 298.45059751 299.92787325 297.73014596 299.92983133 C287.81182347 299.95664981 277.89349606 299.98052714 267.97516337 300.00321633 C267.27711434 300.00481363 266.57906531 300.00641094 265.85986328 300.00805664 C265.16266531 300.00965011 264.46546735 300.01124357 263.74714217 300.01288532 C252.11576956 300.03966723 240.48443569 300.0741877 228.85310292 300.11471039 C221.04159734 300.14149533 213.23013732 300.15939301 205.41859484 300.17074764 C200.55735493 300.17987205 195.69617035 300.19723338 190.83496284 300.21692657 C188.5803292 300.2244016 186.32568137 300.22848311 184.07103539 300.22892189 C180.99286479 300.23000467 177.91497552 300.24325514 174.83685303 300.25950623 C173.49894813 300.25558094 173.49894813 300.25558094 172.13401484 300.25157636 C166.17844214 300.30067859 160.42764626 300.40623946 155.82421875 304.59765625 C153.5696467 308.41974115 152.49280907 312.18889516 151.40625 316.46875 C151.19419922 317.25443359 150.98214844 318.04011719 150.76367188 318.84960938 C147.95676121 328.85180904 147.95676121 328.85180904 151.09375 338.53125 C153.99156104 340.41521215 156.2676069 340.78178258 159.68658066 340.78458309 C161.07055121 340.79300619 161.07055121 340.79300619 162.48248076 340.80159944 C163.49258279 340.79761835 164.50268482 340.79363726 165.543396 340.78953552 C167.15714249 340.79504908 167.15714249 340.79504908 168.80348992 340.80067402 C172.42079885 340.8106814 176.03795488 340.80649771 179.65527344 340.80249023 C182.24383712 340.80687574 184.83239939 340.81217726 187.42095947 340.81832886 C193.00193562 340.83037699 198.58288322 340.83548197 204.16387177 340.83621025 C212.2417711 340.83753587 220.31960112 340.85264773 228.39747599 340.87170542 C241.5146499 340.90255447 254.63182556 340.92671556 267.74902344 340.94458008 C268.53418525 340.94565276 269.31934706 340.94672544 270.12830165 340.94783062 C278.88460516 340.95964615 287.64090937 340.96985176 296.3972168 340.97827148 C299.57047528 340.98134529 302.74373375 340.9844341 305.91699219 340.98754883 C306.6999849 340.98831417 307.48297761 340.98907951 308.28969738 340.98986804 C321.35283504 341.00295684 334.41592264 341.02760745 347.47902322 341.06129223 C355.5343855 341.08156725 363.58964063 341.09187369 371.64502862 341.08930302 C377.82076479 341.0881441 383.99637843 341.1023128 390.17208099 341.12211227 C392.70365797 341.12771423 395.23525225 341.12819478 397.76683044 341.12317467 C401.22346802 341.11703889 404.67957779 341.12925581 408.13616943 341.14598083 C409.13734857 341.13976902 410.13852771 341.1335572 411.17004561 341.12715715 C419.21380584 341.19804618 
        426.18156656 342.61906656 432.09375 348.53125 C436.33409841 354.66256459 437.83574672 360.09779192 437.09375 367.53125 C435.42794903 374.65353287 431.9019504 378.46808236 426.03125 382.78125 C422.07851556 385.13607052 419.03979176 385.65557412 414.48365116 385.66267776 C413.55712083 385.66651891 412.6305905 385.67036005 411.67598349 385.6743176 C410.1542735 385.67301787 410.1542735 385.67301787 408.6018219 385.67169189 C407.52135163 385.67466302 406.44088136 385.67763414 405.32766956 385.6806953 C401.69443144 385.68939109 398.06122623 385.69089131 394.42797852 385.69238281 C391.82782419 385.69701049 389.22767055 385.70203508 386.6275177 385.70742798 C379.55272887 385.7210077 372.47794572 385.72703609 365.40314603 385.73143864 C360.98210547 385.73420292 356.56106709 385.73844074 352.140028 385.74294281 C339.89085433 385.75513738 327.6416824 385.76543478 315.39250278 385.7688179 C314.21654208 385.76914725 314.21654208 385.76914725 313.0168246 385.76948325 C311.83809041 385.76981067 311.83809041 385.76981067 310.63554341 385.7701447 C309.04324313 385.77058816 307.45094285 385.77103473 305.85864258 385.77148438 C305.06881109 385.7717058 304.2789796 385.77192723 303.46521383 385.77215537 C290.68343473 385.77609855 277.90171282 385.79353701 265.11995579 385.8168439 C251.98562998 385.84059945 238.85133279 385.85302174 225.71698517 385.85418582 C218.3473235 385.85510047 210.97773625 385.86079936 203.60809517 385.87900543 C196.66994086 385.89608533 189.73192953 385.89762764 182.7937603 385.88886642 C180.25298561 385.88809749 177.71220326 385.89241971 175.17144775 385.90232468 C153.36926116 385.98230428 135.04553839 384.58243745 118.79296875 368.45703125 C108.07575106 356.8402497 103.31275999 342.71551915 103.59765625 327.04296875 C104.2272524 316.42833973 107.59773307 305.83400187 110.33764648 295.60473633 C114.30234389 279.48863182 110.08656325 266.01708787 104.92041016 250.68652344 C104.51169678 249.46155151 104.1029834 248.23657959 103.68188477 246.9744873 C102.79899776 244.32851064 101.91329175 241.68350165 101.02528763 239.03923798 C99.60549886 234.81139385 98.19221382 230.58139197 96.77963257 226.35113525 C94.52854232 219.61231824 92.27313833 212.87495418 90.01590288 206.13819337 C85.53987762 192.77902785 81.07231495 179.41702995 76.606148 166.05456591 C75.88295922 163.89106392 75.15954854 161.72763622 74.43610191 159.56422043 C67.50759728 138.84248973 60.67865007 118.09085881 53.96247578 97.29924202 C51.29508276 89.04842248 48.57406543 80.81621018 45.77856445 72.60791016 C45.26016085 71.08064336 44.74614069 69.5518844 44.2355957 68.02197266 C43.45596093 65.68614614 42.66497894 63.3544533 41.87109375 61.0234375 C41.64816147 60.34868378 41.42522919 59.67393005 41.19554138 58.97872925 C38.7327267 51.59899439 38.7327267 51.59899439 33.19445801 46.50715637 C27.46332133 44.36240839 21.93218118 44.11825925 15.87109375 44.16015625 C13.93163878 44.14278275 11.99218569 44.12519828 10.05273438 44.10742188 C7.03569147 44.09734622 4.01876804 44.09375704 1.00170898 44.09545898 C-1.93801511 44.09187483 -4.87684284 44.06449465 -7.81640625 44.03515625 C-8.70932877 44.04333878 -9.60225128 44.0515213 -10.52223206 44.05995178 C-17.41084082 43.97874154 -22.97214691 42.43194774 -27.96484375 37.49609375 C-28.64740234 36.49255859 -28.64740234 36.49255859 -29.34375 35.46875 C-30.05337891 
        34.46134766 -30.05337891 34.46134766 -30.77734375 33.43359375 C-34.00054949 28.00210172 -33.31991015 21.63085699 -32.90625 15.53125 C-30.85129146 9.4745301 -27.0089845 5.95721209 -21.78710938 2.41601562 C-15.08250696 -0.82469404 -7.27855775 -0.04198328 0 0 Z "
        fill="#000000"
        transform="translate(32.90625,20.46875)"
      />
      <path
        d="M0 0 C9.57362551 7.58525713 16.0684556 17.77708636 17.5390625 30.01171875 C18.65038825 43.32778259 14.69579863 54.71768706 6.4765625 65.13671875 C-0.51902117 72.7905302 -10.556873 77.81216752 -20.9140625 78.34765625 C-34.16014355 78.59703938 -44.22029515 77.01041085 -54.4609375 68.01171875 C-55.06679688 67.51027344 -55.67265625 67.00882812 -56.296875 66.4921875 C-62.78460873 60.67022557 -67.86838117 51.78647659 -68.63793945 42.98803711 C-69.06609883 28.06045647 -67.62146316 16.73232512 -57.4609375 5.01171875 C-41.32388131 -10.13853904 -18.56637466 -12.76103849 0 0 Z "
        fill="#000000"
        transform="translate(452.4609375,433.98828125)"
      />
      <path
        d="M0 0 C9.57362551 7.58525713 16.0684556 17.77708636 17.5390625 30.01171875 C18.65038825 43.32778259 14.69579863 54.71768706 6.4765625 65.13671875 C-0.51902117 72.7905302 -10.556873 77.81216752 -20.9140625 78.34765625 C-34.16014355 78.59703938 -44.22029515 77.01041085 -54.4609375 68.01171875 C-55.06679687 67.51027344 -55.67265625 67.00882812 -56.296875 66.4921875 C-62.78460873 60.67022557 -67.86838117 51.78647659 -68.63793945 42.98803711 C-69.06609883 28.06045647 -67.62146316 16.73232512 -57.4609375 5.01171875 C-41.32388131 -10.13853904 -18.56637466 -12.76103849 0 0 Z "
        fill="#000000"
        transform="translate(196.4609375,433.98828125)"
      />
    </svg>
  );
};