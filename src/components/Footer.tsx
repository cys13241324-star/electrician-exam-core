import Image from "next/image";
import Link from "next/link";

const colService = [
  { name: "이론 시뮬레이터", href: "/simulator" },
];

const colSupport = [
  { name: "1:1 문의", href: "#" },
];

const colLegal = [
  { name: "이용약관", href: "#" },
  { name: "개인정보 처리방침", href: "#", strong: true },
  { name: "환불정책", href: "#" },
];

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-zinc-200 bg-zinc-50">
      <div className="mx-auto max-w-6xl px-6 py-14">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-5">
          <div className="col-span-2 md:col-span-2">
            <Image
              src="/addto-bi.png"
              alt="addto"
              width={120}
              height={40}
              className="h-8 w-auto opacity-80"
            />
            <p className="mt-1 text-xs font-semibold tracking-wide text-zinc-500">
              VALUE WISDOM
            </p>
            <p className="mt-3 text-sm leading-6 text-zinc-600">
              전기기능사 이론 시뮬레이터.
              <br />
              직접 만지며 이해하는 인터랙티브 학습.
            </p>
            <div className="mt-5 flex gap-2">
              <SocialIcon label="블로그" href="#">
                B
              </SocialIcon>
              <SocialIcon label="네이버 카페" href="#">
                C
              </SocialIcon>
              <SocialIcon label="유튜브" href="#">
                ▶
              </SocialIcon>
              <SocialIcon label="이메일 문의" href="mailto:pay@addto.co.kr">
                @
              </SocialIcon>
            </div>
          </div>

          <FooterColumn title="학습 콘텐츠" items={colService} />
          <FooterColumn title="고객지원" items={colSupport} />
          <FooterColumn title="정책" items={colLegal} />
        </div>

        <div className="mt-10 grid grid-cols-1 gap-3 border-t border-zinc-200 pt-6 text-xs text-zinc-500 sm:grid-cols-[1fr_auto]">
          <div className="space-y-1">
            <p className="font-semibold text-zinc-700">(주)애드투 ADDTO Inc.</p>
            <p>대표: 박경식 · 사업자등록번호: 000-00-00000</p>
            <p>통신판매업 신고번호: 0000-서울강남-00000</p>
            <p>주소: 서울특별시 (대표 사이트 안내 참고)</p>
            <p>고객센터: 평일 10:00~18:00 (점심 12:30~13:30)</p>
          </div>
          <div className="flex items-end justify-end">
            <p>© 2026 addto. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  items,
}: {
  title: string;
  items: { name: string; href: string; strong?: boolean }[];
}) {
  return (
    <div>
      <h4 className="text-sm font-semibold text-zinc-900">{title}</h4>
      <ul className="mt-3 space-y-2 text-sm text-zinc-600">
        {items.map((it) => (
          <li key={it.name}>
            <Link
              href={it.href}
              className={`hover:text-zinc-900 ${it.strong ? "font-semibold text-zinc-800" : ""}`}
            >
              {it.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SocialIcon({
  label,
  href,
  children,
}: {
  label: string;
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      aria-label={label}
      className="flex h-8 w-8 items-center justify-center rounded-full border border-zinc-300 bg-white text-xs font-bold text-zinc-600 transition hover:border-zinc-900 hover:text-zinc-900"
    >
      {children}
    </a>
  );
}
