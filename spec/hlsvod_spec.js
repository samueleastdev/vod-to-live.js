const HLSVod = require('../index.js');
const fs = require('fs');

describe("HLSVod standalone", () => {
  let mockMasterManifest;
  let mockMediaManifest;

  beforeEach(() => {
    mockMasterManifest = function() {
      return fs.createReadStream('testvectors/hls1/master.m3u8');
    };
    mockMediaManifest = function(bandwidth) {
      return fs.createReadStream('testvectors/hls1/' + bandwidth + '.m3u8');
    };
  });

  it("returns the correct number of media sequences", done => {
    mockVod = new HLSVod('http://mock.com/mock.m3u8');
    mockVod.load(mockMasterManifest, mockMediaManifest)
    .then(() => {
      expect(mockVod.getLiveMediaSequencesCount()).toBe(289);
      done();
    });
  });

  it("returns the correct number of bandwidths", done => {
    mockVod = new HLSVod('http://mock.com/mock.m3u8');
    mockVod.load(mockMasterManifest, mockMediaManifest)
    .then(() => {
      expect(mockVod.getBandwidths().length).toBe(4);
      expect(mockVod.getBandwidths()).toEqual(['1497000', '2497000', '3496000', '4497000']);
      done();
    });
  });

  it("has the first segments in the first media sequence and that they are ABR aligned", done => {
    mockVod = new HLSVod('http://mock.com/mock.m3u8');
    mockVod.load(mockMasterManifest, mockMediaManifest)
    .then(() => {
      const seqSegments = mockVod.getLiveMediaSequenceSegments(0);
      expect(seqSegments['2497000'].length).toBe(6);
      expect(seqSegments['2497000'][0][1]).toEqual("https://tv4play-i.akamaihd.net/i/mp4root/2018-01-26/pid200032972(3953564_,T3MP445,T3MP435,T3MP425,T3MP415,T3MP48,T3MP43,T3MP4130,).mp4.csmil/segment1_2_av.ts");
      expect(seqSegments['1497000'][0][1]).toEqual("https://tv4play-i.akamaihd.net/i/mp4root/2018-01-26/pid200032972(3953564_,T3MP445,T3MP435,T3MP425,T3MP415,T3MP48,T3MP43,T3MP4130,).mp4.csmil/segment1_3_av.ts");
      expect(seqSegments['2497000'][5][1]).toEqual("https://tv4play-i.akamaihd.net/i/mp4root/2018-01-26/pid200032972(3953564_,T3MP445,T3MP435,T3MP425,T3MP415,T3MP48,T3MP43,T3MP4130,).mp4.csmil/segment6_2_av.ts");
      expect(seqSegments['1497000'][5][1]).toEqual("https://tv4play-i.akamaihd.net/i/mp4root/2018-01-26/pid200032972(3953564_,T3MP445,T3MP435,T3MP425,T3MP415,T3MP48,T3MP43,T3MP4130,).mp4.csmil/segment6_3_av.ts");
      done();
    });
  });

  it("has the second media sequence not containing the first segment", done => {
    mockVod = new HLSVod('http://mock.com/mock.m3u8');
    mockVod.load(mockMasterManifest, mockMediaManifest)
    .then(() => {
      const seqSegments = mockVod.getLiveMediaSequenceSegments(1);
      expect(seqSegments['2497000'][0][1]).toEqual("https://tv4play-i.akamaihd.net/i/mp4root/2018-01-26/pid200032972(3953564_,T3MP445,T3MP435,T3MP425,T3MP415,T3MP48,T3MP43,T3MP4130,).mp4.csmil/segment2_2_av.ts");
      expect(seqSegments['1497000'][0][1]).toEqual("https://tv4play-i.akamaihd.net/i/mp4root/2018-01-26/pid200032972(3953564_,T3MP445,T3MP435,T3MP425,T3MP415,T3MP48,T3MP43,T3MP4130,).mp4.csmil/segment2_3_av.ts");
      done();
    });
  });

  it("has the last media sequence containing the last segments and that they are ABR aligned", done => {
    mockVod = new HLSVod('http://mock.com/mock.m3u8');
    mockVod.load(mockMasterManifest, mockMediaManifest)
    .then(() => {
      const lastMediaSeq = mockVod.getLiveMediaSequencesCount() - 1;
      const seqSegments = mockVod.getLiveMediaSequenceSegments(lastMediaSeq);
      expect(seqSegments['2497000'][0][1]).toEqual("https://tv4play-i.akamaihd.net/i/mp4root/2018-01-26/pid200032972(3953564_,T3MP445,T3MP435,T3MP425,T3MP415,T3MP48,T3MP43,T3MP4130,).mp4.csmil/segment289_2_av.ts");
      expect(seqSegments['1497000'][0][1]).toEqual("https://tv4play-i.akamaihd.net/i/mp4root/2018-01-26/pid200032972(3953564_,T3MP445,T3MP435,T3MP425,T3MP415,T3MP48,T3MP43,T3MP4130,).mp4.csmil/segment289_3_av.ts");
      expect(seqSegments['2497000'][5][1]).toEqual("https://tv4play-i.akamaihd.net/i/mp4root/2018-01-26/pid200032972(3953564_,T3MP445,T3MP435,T3MP425,T3MP415,T3MP48,T3MP43,T3MP4130,).mp4.csmil/segment294_2_av.ts");
      expect(seqSegments['1497000'][5][1]).toEqual("https://tv4play-i.akamaihd.net/i/mp4root/2018-01-26/pid200032972(3953564_,T3MP445,T3MP435,T3MP425,T3MP415,T3MP48,T3MP43,T3MP4130,).mp4.csmil/segment294_3_av.ts");
      done();
    });
  });
});

describe("HLSVod after another VOD", () => {
  let mockMasterManifest;
  let mockMediaManifest;

  beforeEach(() => {
    mockMasterManifest = function() {
      return fs.createReadStream('testvectors/hls1/master.m3u8');
    };
    mockMediaManifest = function(bandwidth) {
      return fs.createReadStream('testvectors/hls1/' + bandwidth + '.m3u8');
    };
  });

  it("has the first segments from the previous VOD", done => {
    mockVod = new HLSVod('http://mock.com/mock.m3u8');
    mockVod2 = new HLSVod('http://mock.com/mock2.m3u8');
    mockVod.load(mockMasterManifest, mockMediaManifest)
    .then(() => {
      return mockVod2.loadAfter(mockVod, mockMasterManifest, mockMediaManifest);
    }).then(() => {
      const seqSegments = mockVod2.getLiveMediaSequenceSegments(0);
      expect(seqSegments['2497000'][0][1]).toEqual("https://tv4play-i.akamaihd.net/i/mp4root/2018-01-26/pid200032972(3953564_,T3MP445,T3MP435,T3MP425,T3MP415,T3MP48,T3MP43,T3MP4130,).mp4.csmil/segment290_2_av.ts");
      expect(seqSegments['1497000'][0][1]).toEqual("https://tv4play-i.akamaihd.net/i/mp4root/2018-01-26/pid200032972(3953564_,T3MP445,T3MP435,T3MP425,T3MP415,T3MP48,T3MP43,T3MP4130,).mp4.csmil/segment290_3_av.ts");
      expect(seqSegments['2497000'][5][0]).toBe(-1); // Discontinuity
      expect(seqSegments['2497000'][6][1]).toEqual("https://tv4play-i.akamaihd.net/i/mp4root/2018-01-26/pid200032972(3953564_,T3MP445,T3MP435,T3MP425,T3MP415,T3MP48,T3MP43,T3MP4130,).mp4.csmil/segment1_2_av.ts");
      done();
    });
  });
});